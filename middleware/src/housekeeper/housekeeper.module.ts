import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigModule } from '../config/config/config.module';
import { MetricsModule } from '../metrics/metrics.module';
import { PropertiesModule } from '../properties/properties.module';
import { SessionModule } from '../session/session.module';
import { TrackModule } from '../track/track.module';
import { HousekeeperService } from './housekeeper.service';

@Module({
  imports: [
    ConfigModule,
    TrackModule,
    SessionModule,
    MetricsModule,
    PropertiesModule
  ],
  providers: [HousekeeperService],
  exports: [HousekeeperService]
})
export class HousekeeperModule implements OnModuleInit {
  private readonly logger: Logger = new Logger(HousekeeperModule.name);

  constructor(
    private readonly houseKeeperService: HousekeeperService
  ) {

  }
  
  onModuleInit() {
    this.cleanExpiredSessions();
    this.cleanExpiredTracks();
    this.cleanExpiredMetrics();
    this.runDailyFlowMetrics();
  }

  @Cron('*/10 * * * *')
  async cleanExpiredTracks() {

    this.logger.log('cleaning expired tracks');
    let clientTracks = await this.houseKeeperService.cleanExpiredTracks();

    for (let ct of clientTracks) {
      this.logger.log(` * removing expired track ${ct.flowId} tid: ${ct.tid}`);
    }

  }

  @Cron('*/10 * * * *')
  async cleanExpiredSessions() {

    this.logger.log('cleaning expired sessions');
    let userSessions = await this.houseKeeperService.cleanExpiredSessions();

    for (let us of userSessions) {
      this.logger.log(` * removing expired session sid: ${us.sid}`);
    }
  }

  @Cron('0 0 * * *')
  private async cleanExpiredMetrics() {
    this.logger.log('cleaning expired metrics');
    let count = await this.houseKeeperService.cleanExpiredMetrics();

    this.logger.log(` * removed ${count} expired metrics`);
    
  }

  @Cron('0 0 * * *')
  private async runDailyFlowMetrics() {
    this.logger.log('calculating daily metrics');
    await this.houseKeeperService.runDailyFlowMetrics();
    this.logger.log('calculating daily metrics ✅ ');
    
  }
}
