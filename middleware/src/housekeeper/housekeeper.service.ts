import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config/config.service';
import { MetricsService } from '../metrics/metrics.service';
import { ClientTrack } from '../model/client.track';
import { MetricFlowByHour } from '../model/metricFlowByHour';
import { MetricStateFlowProcessor } from '../model/metricStateFlowProcessor';
import { UserSession } from '../model/usersession';
import { PropertiesService } from '../properties/properties.service';
import { SessionService } from '../session/session.service';
import { TrackService } from '../track/track.service';
import { getDayDateInterval } from '../utils/date';

@Injectable()
export class HousekeeperService {

  private readonly logger: Logger = new Logger(HousekeeperService.name);
  private METRIC_STATE_FLOW_PROCESSOR = 'METRIC_STATE_FLOW_PROCESSOR';
  private TRACK_LIFETIME_MONTHS: number

  constructor(
    private readonly configService: ConfigService,
    private readonly trackService: TrackService,
    private readonly sessionService: SessionService,
    private readonly metricService: MetricsService,
    private readonly propertiesService: PropertiesService
  ) {
    this.TRACK_LIFETIME_MONTHS = +this.configService.get('TRACK_LIFETIME_MONTHS');
  }

  async cleanExpiredTracks(): Promise<ClientTrack[]> {

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - this.TRACK_LIFETIME_MONTHS);
    endDate.setHours(0, 0, 0, 0);

    return this.trackService.deleteExpiredTracks(endDate);

  }

  async cleanExpiredSessions(): Promise<UserSession[]> {

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - this.TRACK_LIFETIME_MONTHS);
    endDate.setHours(0, 0, 0, 0);

    return this.sessionService.deleteExpiredSessions(endDate);
  }

  async cleanExpiredMetrics(): Promise<MetricFlowByHour[]> {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - this.TRACK_LIFETIME_MONTHS);
    endDate.setHours(0, 0, 0, 0);
    return this.metricService.removeMetricsByDate(endDate);
  }

  async runDailyFlowMetrics(): Promise<void> {
    let state = (await this.propertiesService.getProperty<MetricStateFlowProcessor>(this.METRIC_STATE_FLOW_PROCESSOR))?.data;
    let startDate = null;

    if (!state) {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - this.TRACK_LIFETIME_MONTHS)
      state = (await this.propertiesService.setProperty<MetricStateFlowProcessor>(this.METRIC_STATE_FLOW_PROCESSOR, new MetricStateFlowProcessor(startDate)))?.data;
    }

    startDate = new Date(state.lastProcessedTimestamp);
    let curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);

    while (startDate < curDate) {
      const dates = getDayDateInterval(startDate);
      for (let pair of dates) {
        this.logger.debug(`processing daily metrics at ${pair[0]}`)
        const dataFlow = await this.trackService.getAggregatedTracksByFlowId(pair[0], pair[1]);
        await this.propertiesService.setProperty<MetricStateFlowProcessor>(this.METRIC_STATE_FLOW_PROCESSOR, new MetricStateFlowProcessor(pair[0]));
        dataFlow.forEach(async (d) => {
          this.metricService.createMetricFlowByHour(pair[0], d.name, d.count)
        })
        await this.propertiesService.setProperty<MetricStateFlowProcessor>(this.METRIC_STATE_FLOW_PROCESSOR, new MetricStateFlowProcessor(pair[1]));
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  }
}
