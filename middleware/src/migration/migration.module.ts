import { DynamicModule, Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service';
import { TrackModule } from '../track/track.module';
import { TrackService } from '../track/track.service';
import { MIGRATION } from './migration.constants';
import { MigrationService } from './migration.service';

@Module({
  providers: [MigrationService]
})
export class MigrationModule   {

  static forRoot(): DynamicModule {
    
    return {
      module: MigrationModule,
      imports: [SessionModule, TrackModule],
      providers: [
        {
          provide: MIGRATION,
          inject: [MigrationService, SessionService, TrackService],
          useFactory: async (migrationService: MigrationService) => {
            return migrationService.runMigrations()
          },
          
        },
        MigrationService,
      ],
      exports: [MigrationService]
    };
  }

}
