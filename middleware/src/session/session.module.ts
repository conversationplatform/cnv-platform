import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { ArangoModule } from '../persistence/arango/arango.module';
import { ConfigModule } from '../config/config/config.module';
import { TrackModule } from '../track/track.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ArangoModule.collection('session'),
    TrackModule
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService]
})
export class SessionModule { }