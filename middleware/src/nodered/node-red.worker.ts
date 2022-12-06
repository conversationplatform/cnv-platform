import {
  parentPort,
  workerData,
} from 'worker_threads';
import { NodeREDWorkerIPC } from './node-red.worker.ipc';
import { NodeRedWorkerSettings } from './nodered.settings.interface';
import { Socket } from 'net';

const express = require('express');
const http = require('http');

const RED = require("node-red");

class NodeREDWorker {
  app = express();
  server;

  constructor(port: number, settings: any) {
    this.app = express();

    this.server = http.createServer(this.app);
    // Initialise the runtime with a server and settings
    settings.logging = {
      console: {
        level: "off"
      },

      customLogger: {
        level: 'all',

        handler: () => {
          return (msg) => {
            try {
              msg.msg.split('\n').forEach(m => {
                this.logger(m)

              });

            } catch (e) {
              this.logger(msg.msg)
            }
          }
        }
      }
    }

    RED.init(this.server, settings);

    // Serve the editor UI from /red
    this.app.use(settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    this.app.use(settings.httpNodeRoot, RED.httpNode);

    RED.start();


    this.server.listen(port, async () => {
      this.logger(`node-RED server started at port ${port}`);
    })

  }

  logger(args) {
    sendMessage({
      type: 'log',
      payload: args
    })
  }
}


const workerSettings: NodeRedWorkerSettings = workerData;
const worker = new NodeREDWorker(workerSettings.port, workerSettings.settings);

parentPort.on('message', async (data) => {
  const message: NodeREDWorkerIPC = JSON.parse(data);

  switch(message.type) {
    case 'exit': process.exit(1);
    case 'ping': sendMessage({
      type: 'pong',
      payload: 'pong'
    }); break;
    case 'isRunning': sendMessage({
      type: 'isRunning',
      payload: await isServiceRunning()
    }); break;

    default: console.log(`data type not recognized '${message.type}'`)
  }
})

const isServiceRunning = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    socket.on('connect', (d) => resolve(d));
    socket.on('timeout', () => reject(false));
    socket.on('error', (e) => reject(e));
    socket.connect(8080, '0.0.0.0')
    socket.setTimeout(5e3, () => socket.destroy());
  })
  
}

const sendMessage = (message: NodeREDWorkerIPC): void => {
  parentPort.postMessage(JSON.stringify(message));
}

