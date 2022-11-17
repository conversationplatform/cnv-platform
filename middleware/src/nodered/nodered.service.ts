import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { NodeRedWorkerSettings } from './nodered.settings.interface';

import { Worker } from 'worker_threads';
import { setInterval } from 'timers';
import { ConfigService } from '../config/config/config.service';
import { HttpService } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';
const os = require('os');

const path = require('path');

import * as fs from 'fs';

const noderedWorker = path.resolve(__dirname, 'node-red.worker.js');

const settings: NodeRedWorkerSettings = {
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
  private healthcheckInterval;
  private healthcheckIntervalTimeout;
  private app;
  private accessToken;
  private accessTokenInterval;

  private readonly logger = new Logger(NoderedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private httpService: HttpService,
  ) {
    this.configService.events.subscribe(() => {
      this.logger.warn(
        'middleware custom properties changed. Nodered will be rebooted to apply the latest configurations',
      );
      this.nodeRedWorker?.terminate(); // nodered will be automaticaly rebooted
    });
    this.accessToken = null;
  }

  async init(app: INestApplication | any) {
    if (this.configService.get('NODERED_HOME_DIR')) {
      settings.settings.userDir = this.configService.get('NODERED_HOME_DIR');
    }

    settings.settings.editorTheme = {
      projects: {
        enabled: JSON.parse(this.configService.get('NODERED_ENABLE_PROJECTS')),
      },
      palette: {
        editable: JSON.parse(this.configService.get('NODERED_ENABLE_PALLETE')),
      },
    };

    if (this.configService.get('NODERED_FLOW_FILE')) {
      settings.settings.flowFile = this.configService.get('NODERED_FLOW_FILE');
    }

    if (this.authService.useAuth) {
      settings.settings.adminAuth = {
        type: 'credentials',
        users: [
          {
            username: this.configService.get('ADMIN_USER'),
            password: this.authService.bcryptpassword,
            permissions: '*',
          },
        ],
      };
    }

    this.app = app;

    this.nodeRedWorker = new Worker(noderedWorker, {
      workerData: settings,
    });

    this.nodeRedWorker.on('message', async (msg) => {
      if ('pong' == msg) {
        this.startHealthCheck();
        if (!this.accessToken) {
          this.logger.log('Running node-red auth');
          const data = <any>await this.auth().catch(e => this.logger.error(e));
          if (data) this.accessToken = data.access_token;
        }
      } else {
        this.logger.debug(msg);
      }
    });
    this.nodeRedWorker.on('error', (msg) => this.logger.error(msg));

    this.nodeRedWorker.on('exit', (code) => {
      if (code !== 0)
        this.logger.error(new Error(`Worker stopped with exit code ${code}`));
    });

    this.healthcheckInterval = setInterval(() => {
      this.nodeRedWorker.postMessage('ping');
    }, 1000);


    this.accessTokenInterval = setInterval(async () => {
      this.logger.log('Running node-red auth');
      const data = <any>await this.auth().catch(e => this.logger.error(e));
      if (data) this.accessToken = data.access_token;
    }, 600000);
  }

  startHealthCheck() {
    clearTimeout(this.healthcheckIntervalTimeout);
    this.healthcheckIntervalTimeout = setTimeout(() => {
      this.nodeRedWorker.terminate();
      this.stopHealthCheck();
      this.logger.warn('NODERED ping timeout, rebooting in 3s');
      setTimeout(() => {
        this.init(this.app);
      }, 3000);
    }, 10000);
  }

  stopHealthCheck() {
    clearTimeout(this.healthcheckIntervalTimeout);
    clearInterval(this.healthcheckInterval);
  }

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

  async getWidgetProviders(): Promise<string[]> {
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
    return widgetProviders;

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
          this.logger.error(err);
          reject(err)
        }
      })

    })
    
    return widgetProvider;

    
  }
}
