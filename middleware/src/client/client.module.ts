import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config/config.module';
import { InteractionModule } from '../interaction/interaction.module';
import { TrackModule } from '../track/track.module';
import { SessionModule } from '../session/session.module';
import { ClientController } from './client.controller';
import { ClientGateway } from './client.gateway';
import { ClientService } from './client.service';

@Module({
  imports: [
    ConfigModule,
    SessionModule,
    TrackModule,
    InteractionModule
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientGateway],
  exports: [ClientService]
})
export class ClientModule {}
