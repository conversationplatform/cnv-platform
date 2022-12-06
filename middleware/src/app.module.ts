import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientModule } from './client/client.module';
import { ArangoModule } from './persistence/arango/arango.module';
import { ConfigModule } from './config/config/config.module';
import { ConfigService } from './config/config/config.service';
import { SessionModule } from './session/session.module';
import { TrackModule } from './track/track.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

import { ScheduleModule } from '@nestjs/schedule';
import { MetricsModule } from './metrics/metrics.module';

import { PropertiesModule } from './properties/properties.module';
import { InteractionModule } from './interaction/interaction.module';
import { HousekeeperModule } from './housekeeper/housekeeper.module';
import { PublicModule } from './public/public.module';
import { NoderedModule } from './nodered/nodered.module';
import { BehaviorSubject } from 'rxjs';
import { NodeRedOptions } from './nodered/nodered.settings.interface';

const os = require('os');


@Module({
  imports: [
    AuthModule,
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
    SessionModule,
    InteractionModule,
    TrackModule,
    MetricsModule,
    ScheduleModule.forRoot(),
    PublicModule,
    ClientModule,
    NoderedModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      useFactory: (configService: ConfigService, authService: AuthService) => {
        function createOptions(): NodeRedOptions {
          return {
            home_dir: configService.get('NODERED_HOME_DIR'),
            enable_pallete: JSON.parse(configService.get('NODERED_ENABLE_PALLETE')),
            enable_projects: JSON.parse(configService.get('NODERED_ENABLE_PROJECTS')),
            flow_file: configService.get('NODERED_FLOW_FILE'),
            admin_user: configService.get('ADMIN_USER'),
            admin_password_encrypted: authService.bcryptpassword,
            admin_password_plain: configService.get('ADMIN_PASSWORD')
          }
        }

        const configSubject = new BehaviorSubject<NodeRedOptions>(createOptions())
        configService.events.subscribe((event) => {
          configSubject.next(createOptions());
        })
        
        return configSubject;

      },
      inject: [ConfigService, AuthService],
    }),

  ],
  controllers: [AppController],
})
export class AppModule { }