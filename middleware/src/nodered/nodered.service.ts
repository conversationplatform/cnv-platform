import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodeRedOptions, NodeRedWorkerSettings } from './nodered.settings.interface';

import { Worker } from 'worker_threads';
import { ConfigService } from '../config/config/config.service';
import { HttpService } from '@nestjs/axios';

const os = require('os');

const path = require('path');

import * as fs from 'fs';
import { IWidgetProviders } from 'src/interface/widgetProviders.interface';
import { NODEREDOPTIONS } from './nodered.constants';
import { BehaviorSubject } from 'rxjs';
import { NodeREDState } from './node-red.worker.state';
import { NodeREDWorkerIPC } from './node-red.worker.ipc';
import { SchedulerRegistry } from '@nestjs/schedule';

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

  private nodeRedState: NodeREDState = NodeREDState.DISABLED;
  private $nodeRedState: BehaviorSubject<NodeREDState> = new BehaviorSubject(NodeREDState.DISABLED);

  private readonly logger = new Logger(NoderedService.name);
  private workerLogger = new Logger("NodeREDWorker");

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    @Inject(NODEREDOPTIONS) private nodeRedOptionsBehaviour: BehaviorSubject<NodeRedOptions>,
    private readonly schedulerRegistry: SchedulerRegistry

  ) {
    this.accessToken = null;

    this.packageVersion = process.env.npm_package_version || '1.0.0';
    this.nodeRedOptionsBehaviour.subscribe(options => this.setOptions(options));
    this.$nodeRedState.subscribe(state => {
      if (state != this.nodeRedState) {
        this.logger.debug(`NodeRED worker status changed ${this.nodeRedState} => ${state}`)
        this.nodeRedState = state;
        switch (this.nodeRedState) {
          case NodeREDState.STOPPED: this.restart(); break;
          case NodeREDState.PENDING: this.logger.warn('should start cenas'); break;
          case NodeREDState.ERROR: this.logger.error('error'); break;
        }
      }
    });

    setInterval(() => {
      this.restart()
    }, 10000)
  }

  async setOptions(options: NodeRedOptions) {
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

    if(this.nodeRedState != NodeREDState.DISABLED) {
      this.$nodeRedState.next(NodeREDState.STOPPED);
    }
  }

  public enable(): void {
    this.$nodeRedState.next(NodeREDState.STOPPED);
  }

  // async init2(app: INestApplication | any) {
  //   if (this.configService.get('NODERED_HOME_DIR')) {
  //     defaultSettings.settings.userDir = this.configService.get('NODERED_HOME_DIR');
  //   }

  //   defaultSettings.settings.editorTheme = {
  //     projects: {
  //       enabled: JSON.parse(this.configService.get('NODERED_ENABLE_PROJECTS')),
  //     },
  //     palette: {
  //       editable: JSON.parse(this.configService.get('NODERED_ENABLE_PALLETE')),
  //     },
  //   };

  //   if (this.configService.get('NODERED_FLOW_FILE')) {
  //     defaultSettings.settings.flowFile = this.configService.get('NODERED_FLOW_FILE');
  //   }

  //   if (this.authService.useAuth) {
  //     defaultSettings.settings.adminAuth = {
  //       type: 'credentials',
  //       users: [
  //         {
  //           username: this.configService.get('ADMIN_USER'),
  //           password: this.authService.bcryptpassword,
  //           permissions: '*',
  //         },
  //       ],
  //     };
  //   }

  //   this.app = app;

  //   this.nodeRedWorker = new Worker(noderedWorker, {
  //     workerData: defaultSettings,
  //   });

  //   this.nodeRedWorker.on('message', async (msg) => {
  //     if ('pong' == msg) {
  //       this.startHealthCheck();
  //       if (!this.accessToken) {
  //         this.logger.log('Running node-red auth');
  //         const data = <any>await this.auth().catch(e => this.logger.error(e));
  //         if (data) this.accessToken = data.access_token;
  //       }
  //     } else {
  //       this.logger.debug(msg);
  //     }
  //   });
  //   this.nodeRedWorker.on('error', (msg) => this.logger.error(msg));

  //   this.nodeRedWorker.on('exit', (code) => {
  //     if (code !== 0)
  //       this.logger.error(new Error(`Worker stopped with exit code ${code}`));
  //   });

  //   this.healthcheckInterval = setInterval(() => {
  //     this.nodeRedWorker.postMessage('ping');
  //   }, 1000);


  //   this.accessTokenInterval = setInterval(async () => {
  //     this.logger.log('Running node-red auth');
  //     const data = <any>await this.auth().catch(e => this.logger.error(e));
  //     if (data) this.accessToken = data.access_token;
  //   }, 600000);
  // }

  private async start() {
    
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
      //this.stop();
    });

    this.nodeRedWorker.on('exit', async (code) => {
      if (code !== 0) {
        this.logger.error(`Worker threadId: ${this.nodeRedWorker.threadId} stopped with exit code ${code}`);
        
      }
        
    });

    this.$nodeRedState.next(NodeREDState.PENDING);

  }

  private async stop() {
    
    if (this.nodeRedWorker && this.nodeRedState != NodeREDState.STOPPED) {
      
      console.log(`invoking terminate on threadId ${this.nodeRedWorker.threadId}`)

      //this.nodeRedWorker.terminate();
      this.sendIPCMessage({
        type: 'exit'
      })
      
      this.$nodeRedState.next(NodeREDState.STOPPED);
      
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        this.nodeRedWorker = null;
          resolve(true);
      }, 5000);
    })
  }

  private async restart() {
    console.log(this.nodeRedWorker?.threadId);
    await this.stop();
    await this.start();
  }

  // startHealthCheck() {
  //   clearTimeout(this.healthcheckIntervalTimeout);
  //   this.healthcheckIntervalTimeout = setTimeout(() => {
  //     this.nodeRedWorker.terminate();
  //     this.stopHealthCheck();
  //     this.logger.warn('NODERED ping timeout, rebooting in 3s');
  //     setTimeout(() => {
  //       this.init(this.app);
  //     }, 3000);
  //   }, 10000);
  // }

  // stopHealthCheck() {
  //   clearTimeout(this.healthcheckIntervalTimeout);
  //   clearInterval(this.healthcheckInterval);
  // }

  async getCurrentFlows(): Promise<string[]> {
    const NODERED_HTTP_CONNECTION = this.configService.get(
      'NODERED_HTTP_CONNECTION',
    );
    return new Promise((resolve, reject) => {
      this.httpService
        .get(`${NODERED_HTTP_CONNECTION}/red/current_flows`, {
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
    const NODERED_HTTP_CONNECTION = this.configService.get(
      'NODERED_HTTP_CONNECTION',
    );

    return new Promise((resolve, reject) => {
      this.httpService
        .get(`${NODERED_HTTP_CONNECTION}/red/getTheme?flowId=${flowId}`, {
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

  async getPrivacyPolicyByFlowId(flowId: string): Promise<any> {
    const NODERED_HTTP_CONNECTION = this.configService.get(
      'NODERED_HTTP_CONNECTION',
    );

    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `${NODERED_HTTP_CONNECTION}/red/getPrivacyPolicy?flowId=${flowId}`,
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
            this.logger.error(err);
            reject(err);
          },
        });
    });
  }

  async auth(): Promise<string> {
    const server_url = this.configService.get('NODERED_HTTP_CONNECTION');
    const username = this.configService.get('ADMIN_USER');
    const password = this.configService.get('ADMIN_PASSWORD');
    return new Promise((resolve, reject) => {
      this.httpService
        .post(`${server_url}/red/auth/token`, {
          client_id: 'node-red-admin',
          grant_type: 'password',
          scope: '*',
          username,
          password,
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
    const NODERED_HTTP_CONNECTION = this.configService.get(
      'NODERED_HTTP_CONNECTION',
    );

    const path = `${NODERED_HTTP_CONNECTION}/red/resources/${widget}/widgetProvider.js`;
    const widgetProvider: any = await new Promise((resolve, reject) => {
      this.httpService.get(
        `${NODERED_HTTP_CONNECTION}/red/resources/${widget}/widgetProvider.js`
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
    this.nodeRedWorker.postMessage(JSON.stringify(message));
  }
  

}
