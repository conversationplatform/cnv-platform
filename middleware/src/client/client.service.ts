import { Injectable, Logger } from '@nestjs/common';
import { ClientBroker } from '../model/client.broker';
import { ConfigService } from '../config/config/config.service';
import { TrackService } from '../track/track.service';
import { ActiveClientsByFlows } from '../model/ActiveClientsByFlows.interface';
import { ActiveTrack } from '../model/ActiveTrack';
import { InteractionService } from '../interaction/interaction.service';

@Injectable()
export class ClientService {
    private logger: Logger = new Logger(ClientService.name)
    private clients: ClientBroker[]; 
    private WSCONN;
    constructor(
        private readonly configService: ConfigService,
        private readonly trackService: TrackService,
        private readonly interactionService: InteractionService
    ) {
        this.clients = [];
        this.WSCONN = this.configService.get("NODERED_WS_CONNECTION") || 'ws://localhost:8080';
    }

    public getActiveClients(): ClientBroker[] {
        return this.clients
    }

    public getActiveTracks(): ActiveTrack[] {
        return this.clients.map(clientBroker => {
            const {
                date,
                flowId,
                sid,
                tid
            } = clientBroker.clientTrack;
            return {
                date,
                flowId,
                sid,
                tid
            };
        })
    }

    public getActiveClientsByFlows(): ActiveClientsByFlows[] {
        const activeTracks = this.getActiveTracks();
        const flows = [...new Set(activeTracks.map(track => track.flowId))];
        return flows.map(flowId => ({
            flowId,
            numClients: activeTracks.filter(t => t.flowId === flowId).length
        }))
    }

    public async handleConnection(client: any) {
        const session_cookie_name = this.configService.get('SESSION_COOKIE_NAME');
        const sid = client.handshake.headers.cookie?.split(';').filter(c => c.indexOf(session_cookie_name) > -1)?.[0].split('=')?.[1];
        const tid = client.handshake.query.tid;


        let clientTrack = await this.trackService.getTrack(sid, tid);
        if(!clientTrack) {
            client.disconnect();
            return;
        }
        try {
            this.clients.push(
                new ClientBroker(
                    client,
                    `${this.WSCONN}${client.nsp.name}`,
                    clientTrack,
                    this.trackService,
                    this,
                    this.interactionService
                )
                );
        } catch(e) {
            client.disconnect();
            console.error(e);
        }
    }

    public handleDisconnect(client) {

        const currClient = this.clients.filter(c => {
            return c.remoteClient.id == client.id;
        })
        if(currClient.length > 0) {
            currClient[0].terminate();
            const idx = this.clients.indexOf(currClient[0]);
            if (idx > -1) {
                this.clients.splice(idx, 1);
            }
        }
    }
}
