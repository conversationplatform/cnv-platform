import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { ClientModule } from '../client/client.module';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from '../track/track.module';
import { SessionModule } from '../session/session.module';
import { ArangoModule } from '../persistence/arango/arango.module';
import { ConfigModule } from '../config/config/config.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  providers: [MetricsService],
  controllers: [MetricsController],
  imports: [
    ArangoModule.collection('metrics'),
    AuthModule,
    ClientModule,
    TrackModule,
    SessionModule,
    ConfigModule,
    PropertiesModule
  ],
  exports: [MetricsService]
})
export class MetricsModule { }
