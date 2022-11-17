import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { ArangoModule } from '../persistence/arango/arango.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config/config.module';
import { InteractionModule } from '../interaction/interaction.module';

@Module({
  imports: [
    ArangoModule.collection('track'),
    AuthModule,
    ConfigModule,
    InteractionModule
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService]
})
export class TrackModule { }