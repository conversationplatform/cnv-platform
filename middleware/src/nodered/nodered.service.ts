import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodeRedOptions, NodeRedWorkerSettings } from './nodered.settings.interface';

import { Worker } from 'worker_threads';
import { ConfigService } from '../config/config/config.service';
import { HttpService } from '@nestjs/axios';

const os = require('os');

const path = require('path');

import { Socket } from 'net';

import * as fs from 'fs';
import { IWidgetProviders } from 'src/interface/widgetProviders.interface';
import { NODEREDOPTIONS } from './nodered.constants';
import { BehaviorSubject } from 'rxjs';
import { NodeREDState } from './node-red.worker.state';
import { NodeREDWorkerIPC } from './node-red.worker.ipc';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

const noderedWorker = path.resolve(__dirname, 'node-red.worker.js');

const defaultSettings: NodeRedWorkerSettings = {
  port: 1880,
  settings: {
    httpAdminRoot: '/red',
    httpNodeRoot: '/red-api',
    userDir: `${os.homedir()}/.node-red/`,
    functionGlobalContext: {}, // enables global context
    disableEditor: false,
    apiMaxLength: '1000Mb',
  },
};

@Injectable()
export class NoderedService {
  private nodeRedWorker: Worker;

  private accessToken;
  private packageVersion;

  nodeRedState: NodeREDState = NodeREDState.DISABLED;

  private $nodeRedState: BehaviorSubject<NodeREDState> = new BehaviorSubject(NodeREDState.DISABLED);

  private readonly logger = new Logger(NoderedService.name);
  private workerLogger = new Logger("NodeREDWorker");

  private server_url = '';
  private options: NodeRedOptions;

  // jobs
  private statusJob: CronJob;
  private authJob: CronJob;

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    @Inject(NODEREDOPTIONS) private nodeRedOptionsBehaviour: BehaviorSubject<NodeRedOptions>,
    private readonly schedulerRegistry: SchedulerRegistry

  ) {
    this.server_url = this.configService.get('NODERED_HTTP_CONNECTION');

    this.packageVersion = process.env.npm_package_version || '1.0.0';
    this.nodeRedOptionsBehaviour.subscribe(options => this.setOptions(options));
    this.$nodeRedState.subscribe(async (state) => {
      if (state != this.nodeRedState) {
        this.logger.debug(`NodeRED worker status changed ${this.nodeRedState} => ${state}`)
        this.nodeRedState = state;
        switch (this.nodeRedState) {
          case NodeREDState.STOPPED: await this.start(); break;
          case NodeREDState.RESTARTING:
          case NodeREDState.STOPPING:
            this.statusJob.stop();
            this.authJob.stop();
            await this.stop();

            break;
          case NodeREDState.PENDING:
            this.statusJob.start();
            this.authJob.start();
            break;
          case NodeREDState.ERROR: await this.stop(); break;
          case NodeREDState.RUNNING: await this.authenticate(); break;
        }
      }
    });

    this.statusJob = new CronJob(`*/10 * * * * *`, async () => {
      const isRunning = await this.checkPortStatus('0.0.0.0', 1880);
      if (isRunning) {
        if (this.nodeRedState != NodeREDState.RUNNING) {
          this.$nodeRedState.next(NodeREDState.RUNNING)
        }
      } else {
        if (this.nodeRedState == NodeREDState.RUNNING) {
          this.$nodeRedState.next(NodeREDState.UNRESPONSIVE)
        } else if (this.nodeRedState == NodeREDState.UNRESPONSIVE) {
          this.$nodeRedState.next(NodeREDState.STOPPING)
        }
      }
    })

    this.schedulerRegistry.addCronJob('statusJob', this.statusJob);

    this.authJob = new CronJob(`*/10 * * * *`, async () => await this.authenticate() );

    this.schedulerRegistry.addCronJob('authJob', this.authJob);

  }


  async setOptions(options: NodeRedOptions) {
    this.options = options;
    if (options.home_dir) {
      defaultSettings.settings.userDir = options.home_dir;
    }

    defaultSettings.settings.editorTheme = {
      projects: {
        enabled: options.enable_projects,
      },
      palette: {
        editable: options.enable_pallete,
      },
    };

    if (options.flow_file) {
      defaultSettings.settings.flowFile = options.flow_file;
    }

    defaultSettings.settings.adminAuth = {
      type: 'credentials',
      users: [
        {
          username: options.admin_user,
          password: options.admin_password_encrypted,
          permissions: '*',
        },
      ],
    }

    if (this.nodeRedState != NodeREDState.DISABLED) {
      this.$nodeRedState.next(NodeREDState.RESTARTING);
    }
  }

  public enable(): void {
    setTimeout(() => {
      this.$nodeRedState.next(NodeREDState.STOPPED);
    }, 1000)
  }

  private async start() {
    if (this.nodeRedState != NodeREDState.STOPPED) {
      this.logger.error("can't start another nodeRed since there is already a worker present.")
    }
    this.nodeRedWorker = new Worker(noderedWorker, {
      workerData: defaultSettings,

    });
    this.workerLogger = new Logger(`NodeREDWorker-${this.nodeRedWorker.threadId}`)
    this.nodeRedWorker.on('message', async (msg) => {
      const message: NodeREDWorkerIPC = JSON.parse(msg);

      switch (message.type) {
        case 'log': this.workerLogger.log(message.payload); break;
        default: this.workerLogger.debug(message)
      }

    });

    this.nodeRedWorker.on('error', (msg) => {
      this.logger.error(msg);
    });

    this.nodeRedWorker.on('exit', async (code) => {
      if (code !== 0) {
        this.workerLogger.error(`Worker stopped with exit code ${code}`);
        if (this.nodeRedState != NodeREDState.STOPPING) {
          this.$nodeRedState.next(NodeREDState.ERROR);
        }
      }
    });
    this.$nodeRedState.next(NodeREDState.PENDING);
  }

  private async stop(): Promise<void> {
    switch (this.nodeRedState) {
      case NodeREDState.STOPPING:
        await this.nodeRedWorker?.terminate();
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$nodeRedState.next(NodeREDState.STOPPED);
            resolve();
          }, 1000);
        })

      default: this.$nodeRedState.next(NodeREDState.STOPPING);
    }

  }

  async getCurrentFlows(): Promise<string[]> {

    return new Promise((resolve, reject) => {
      this.httpService
        .get(`${this.server_url}/red/current_flows`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (err) => {
            this.logger.error(err);
            reject(err);
          },
        });
    });
  }

  async getThemeByFlowId(flowId: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.httpService
        .get(`${this.server_url}/red/getTheme?flowId=${flowId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (err) => {
            this.logger.error(`getThemeByFlowId:: ${err}`);
            reject(err);
          },
        });
    });
  }

  async getPrivacyPolicyByFlowId(flowId: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `${this.server_url}/red/getPrivacyPolicy?flowId=${flowId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        )
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (err) => {
            this.logger.error(`getPrivacyPolicyByFlowId:: ${err}`);
            reject(err);
          },
        });
    });
  }


  public isAuthenticated() {
    return this.accessToken != null;
  }
  
  private async authenticate() {
    this.logger.log('Running node-red auth');
    const data = <any>await this.auth().catch(e => this.logger.error(e));
    if (data) this.accessToken = data.access_token;
  }

  private async auth(): Promise<string> {

    return new Promise((resolve, reject) => {
      this.httpService
        .post(`${this.server_url}/red/auth/token`, {
          client_id: 'node-red-admin',
          grant_type: 'password',
          scope: '*',
          username: this.options.admin_user,
          password: this.options.admin_password_plain,
        })
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (err) => {
            this.logger.error(err);
            reject(err);
          },
        });
    });
  }

  async getWidgetProviders(): Promise<IWidgetProviders> {
    const installedNodesPath = path.resolve(this.configService.get('NODERED_HOME_DIR'), '.config.nodes.json')
    const installedNodes = JSON.parse(fs.readFileSync(installedNodesPath).toString())
    let widgetProviders = [];

    for (let pkg in installedNodes) {
      const _pkg = installedNodes[pkg];
      const nodes = _pkg.nodes;
      const nodeDir = `${nodes[Object.keys(nodes)[0]].file.split(pkg)[0]}${pkg}/resources/`;
      try {
        const files = fs.readdirSync(nodeDir);
        if (files.indexOf('widgetProvider.js') > -1) {
          widgetProviders.push(pkg);
        }
      } catch (e) {
      }
    }
    return {
      version: this.packageVersion,
      widgets: widgetProviders
    }

  }

  async getWidgetProvider(widget: string): Promise<any> {


    const path = `${this.server_url}/red/resources/${widget}/widgetProvider.js`;
    const widgetProvider: any = await new Promise((resolve, reject) => {
      this.httpService.get(
        `${this.server_url}/red/resources/${widget}/widgetProvider.js`
      ).subscribe({
        next: (res) => {
          resolve(res.data);
        },
        error: (err) => {
          reject(err)
        }
      })

    })

    return widgetProvider;
  }

  private sendIPCMessage(message: NodeREDWorkerIPC): void {
    this.nodeRedWorker?.postMessage(JSON.stringify(message));
  }

  private checkPortStatus(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new Socket();
      socket.on('connect', () => resolve(true));
      socket.on('timeout', () => resolve(false));
      socket.on('error', (e) => resolve(false));
      socket.connect(port, host)
      socket.setTimeout(5e3, () => socket.destroy());
    })

  }

}
