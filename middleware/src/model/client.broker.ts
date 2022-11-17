import { Logger } from "@nestjs/common";
import { TrackService } from '../track/track.service';
import * as WebSocket from 'ws';

import { JSONSanitizer } from "../utils/sanitizer";
import { Interaction, OriginInteraction } from "./client.interaction";
import { ClientTrack } from "./client.track";
import { ClientService } from "../client/client.service";
import { InteractionService } from "../interaction/interaction.service";

export class ClientBroker {
  private readonly logger = new Logger(ClientBroker.name);
  private USER_INACTIVE_PERIOD = 3600000;
  remoteClient: any;
  remoteServer: any;
  clientTrack: ClientTrack;
  isReady: boolean;
  isTerminated: boolean = false;
  inactivityTimeout: NodeJS.Timeout;

  constructor(
    remoteClient: any,
    remoteServerURL: string,
    clientTrack: ClientTrack,
    private readonly trackService: TrackService,
    private readonly clientService: ClientService,
    private readonly interactionService: InteractionService
  ) {

    this.remoteClient = remoteClient;
    this.clientTrack = clientTrack;
    this.isReady = false;
    this.createRemoteServer(remoteServerURL);
    this.inactivityTimeout = setTimeout(() => {
      this.logger.log("User inactive, terminatting");
      this.clientService.handleDisconnect(this.remoteClient)
    }, this.USER_INACTIVE_PERIOD);


    this.remoteClient.on("message", async (data) => {
      let _data;
      try {

        _data = JSON.parse(data);
        //JSONSanitizer(_data);
      } catch (e) {
        _data = data;
      }

      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(() => {
        this.logger.log("User inactive, terminatting");
        let jsonData = { "type": "abortNode" };
        this.interactionService.createInteraction(new Interaction(this.clientTrack.tid, this.clientTrack.flowId, OriginInteraction.SERVER, jsonData));
        this.clientService.handleDisconnect(this.remoteClient)
      }, this.USER_INACTIVE_PERIOD);

      if (this.remoteServer.readyState === WebSocket.OPEN) {
        if (_data.type !== 'event') {
          this.remoteServer.send(JSON.stringify(_data));
        }
      }

      try {
        await this.interactionService.createInteraction(new Interaction(this.clientTrack.tid, this.clientTrack.flowId, OriginInteraction.CLIENT, _data))
      } catch (e) {
        this.logger.error(e);
        this.clientService.handleDisconnect(this.remoteClient)
      }
    })
  }

  private createRemoteServer(remoteURL: string) {

    this.remoteServer = new WebSocket(remoteURL);

    this.remoteServer.on("error", async (data) => {
      this.logger.log(`connection ERROR between client ${this.remoteClient.id} with trackid: ${this.clientTrack.tid} and nodeRED`);
      this.remoteServer.removeEventListener("open");
      this.remoteServer.removeEventListener("error");
      this.remoteServer.removeEventListener("close");
      this.remoteServer.removeEventListener("message");

      setTimeout(() => {
        if (!this.isTerminated) {
          this.logger.debug('creating remote server')
          this.createRemoteServer(remoteURL);
        }
      }, 1000)

    })

    this.remoteServer.on("message", async (data) => {
      const currentTimestamp = new Date();
      if (!this.isReady) {
        return;
      }

      const jsonData = JSON.parse(data);
      
      if (jsonData.type === "store") {

        try {
          await this.trackService.updateStore(this.clientTrack, jsonData.data);

        } catch (e) {
          this.logger.error(e);
          this.clientService.handleDisconnect(this.remoteClient)
        }
        return;
      }

      if (!(jsonData.type == "startNode" || jsonData.type == "endNode" || jsonData.type == "question" || jsonData.type == "answer" || jsonData.type == "event")) {
        this.remoteClient.emit("message", data);
      }

      await this.interactionService.createInteraction(new Interaction(this.clientTrack.tid, this.clientTrack.flowId, OriginInteraction.SERVER, jsonData, currentTimestamp))
    })

    this.remoteServer.on("open", async () => {

      this.logger.log(`established connection between client ${this.remoteClient.id} with trackid: ${this.clientTrack.tid} and nodeRED`);
      const count = await this.interactionService.countInteractions(this.clientTrack.flowId, this.clientTrack.tid);
      const interactions = await this.interactionService.getInteractions(0, count, this.clientTrack.flowId, this.clientTrack.tid);

      if (interactions.length > 0) {
        this.isReady = false;
        this.logger.log('resync client with nodeRED');
        const clientMessages = interactions.filter(d => d.origin == OriginInteraction.CLIENT).map(d => d.data);
        let interval = 600;
        clientMessages.forEach((data, index, array) => {
          if (!(data.type == "startNode" || data.type == "endNode" || data.type == "question" || data.type == "answer" || data.type == "event")) {
            setTimeout(() => {
              this.remoteServer.send(JSON.stringify(data));
              if (index === array.length - 1) {
                setTimeout(() => {
                  this.isReady = true;

                }, 1000)
                this.logger.log('resync client finished')
              }
              interval += 100;
            }, interval);
          }
        })
      } else {
        this.isReady = true;
      }


    })

    this.remoteServer.on("close", async (data) => {
      this.logger.log(`connection Closed between client ${this.remoteClient.id} with trackid: ${this.clientTrack.tid} and nodeRED`);

      this.remoteServer.removeEventListener("open");
      this.remoteServer.removeEventListener("error");
      this.remoteServer.removeEventListener("close");
      this.remoteServer.removeEventListener("message");

      setTimeout(() => {

        this.createRemoteServer(remoteURL);
      }, 1000)

    })

  }

  public async terminate() {
    this.remoteServer.removeEventListener("open");
    this.remoteServer.removeEventListener("error");
    this.remoteServer.removeEventListener("close");
    this.remoteServer.removeEventListener("message");
    this.isTerminated = true;
    this.remoteClient.disconnect();
    setTimeout(() => {
      this.remoteServer.close();
    }, 20);
  }
}