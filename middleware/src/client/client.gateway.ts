import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';

import { ClientService } from './client.service';

@WebSocketGateway({  namespace: /^.*$/,
  transports: [
    'websocket',
    'polling'
  ],
  cookie: true
  
})
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ClientGateway.name);

  constructor(private readonly clientService: ClientService) {
    this.logger.debug('gateway online');
  }
  
  handleConnection(client: any, ...args: any[]) {
    this.logger.debug(`client connected:: ${client.id} on flow: ${client.nsp.name}`);
    this.clientService.handleConnection(client);
  }

  handleDisconnect(client: any) {
    this.logger.debug(`client disconnected:: ${ client.id}`);
    this.clientService.handleDisconnect(client);
  }
}
