import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { ArangoModule } from './persistence/arango/arango.module';
import { ConfigModule } from './config/config/config.module';

import { ConfigService } from './config/config/config.service';
import { SessionModule } from './session/session.module';
import { TrackModule } from './track/track.module';
import { NoderedModule } from './nodered/nodered.module';
import { AuthModule } from './auth/auth.module';

import { ScheduleModule } from '@nestjs/schedule';
import { MetricsModule } from './metrics/metrics.module';

import { PropertiesModule } from './properties/properties.module';
import { InteractionModule } from './interaction/interaction.module';
import { HousekeeperModule } from './housekeeper/housekeeper.module';
import { PublicModule } from './public/public.module';


@Module({
  imports: [
    ArangoModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('ARANGO_HOST'),
        user: configService.get('ARANGO_USER'),
        password: configService.get('ARANGO_PASSWORD'),
        database: configService.get('ARANGO_DATABASE'),
      }),
    }),
    ConfigModule,
    PropertiesModule,
    HousekeeperModule,
    AuthModule,
    SessionModule,
    ClientModule,
    InteractionModule,
    TrackModule,
    MetricsModule,
    ScheduleModule.forRoot(),
    PublicModule,
    NoderedModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }