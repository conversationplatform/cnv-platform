import {
  parentPort,
  workerData,
} from 'worker_threads';
import { NodeRedWorkerSettings } from './nodered.settings.interface';

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


    this.server.listen(port, () => {
      this.logger(`node-RED server started at port ${port}`)
    })

  }

  logger(args) {
    parentPort.postMessage(args);
  }
}


const workerSettings: NodeRedWorkerSettings = workerData;
const worker = new NodeREDWorker(workerSettings.port, workerSettings.settings);


parentPort.on('message', (data) => {
  if ('exit' == data) {
    process.exit(0)
  }
  if ('ping' == data) {
    parentPort.postMessage('pong');
  }
})
