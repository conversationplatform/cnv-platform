import { HttpException, Injectable, Logger } from '@nestjs/common';
import { aql } from 'arangojs';
import { ClientService } from '../client/client.service';
import { ActiveClientsByFlows } from '../model/ActiveClientsByFlows.interface';
import { ActiveTrack } from '../model/ActiveTrack';
import { AggregatedMetricsFlowByHour } from '../model/aggregatedMetricsFlowByHour';
import { AggregatedSessionByBrowser } from '../model/aggregatedSessionByBrowser';
import { AggregatedSessionByLocation } from '../model/aggregatedSessionByLocation';
import { AggregatedSessionByOS } from '../model/aggregatedSessionByOS';
import { AggregatedTrackByFlowId } from '../model/aggregatedTrackByFlowId';
import { MetricFlowByHour } from '../model/metricFlowByHour';
import { NormalizedMetricsFlowByHour } from '../model/normalizedMetricsFlowByHour';
import { ArangoService } from '../persistence/arango/arango.service';
import { SessionService } from '../session/session.service';
import { TrackService } from '../track/track.service';
import { getDayDateInterval } from '../utils/date';

@Injectable()
export class MetricsService {
    private readonly logger = new Logger(MetricsService.name);
    constructor(
        private readonly clientService: ClientService,
        private readonly sessionService: SessionService,
        private readonly trackService: TrackService,
        private readonly arangoService: ArangoService
    ) {

    }

    async createMetricFlowByHour(timestamp: Date, name: string, count: number): Promise<MetricFlowByHour> {
        const metric = new MetricFlowByHour(timestamp, name, count);

        const insert = this.arangoService.collection.save(metric);
        if (insert) {
            return metric;
        }
    }

    async getMetricsFlowByHour(startDate: Date, endDate: Date): Promise<MetricFlowByHour[]> {
        const query = aql`
            FOR m in ${this.arangoService.collection}
            FILTER m.type == "METRIC_FLOW_BY_HOUR"
            FILTER m.date > ${startDate}
            FILTER m.date < ${endDate}
            RETURN m
            `;

        return this.arangoService.database.query(query)
            .then(res => res.all())
            .catch(e => {
                this.logger.error(e)
                throw new HttpException(e.response.body.errorMessage, e.code)
            })
    }

    async getNormalizedMetricsFlowByHour(startDate: Date, endDate: Date): Promise<NormalizedMetricsFlowByHour> {

        const aggregatedResults = await this.getAggregatedMetricsFlowByHour(startDate, endDate);
        const flows: Set<string> = new Set();

        aggregatedResults.forEach(res => {
            res.results.forEach(r => flows.add(r.flowId));
        })

        const flowIds = Array.from(flows);

        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        
        const dates: Date[] = [];

        while (sDate <= eDate) {
            const interval = getDayDateInterval(sDate);
            for (let pair of interval) {
                dates.push(pair[0]);

            }
            sDate.setDate(sDate.getDate() + 1);
        }

        let normalizedData: NormalizedMetricsFlowByHour = {};

        normalizedData['timestamp'] = dates;


        flowIds.forEach(flow => {
            normalizedData[flow] = [];
        })

        dates.forEach(date => {
            const ar = aggregatedResults
                .filter(aggregated => new Date(aggregated.timestamp).getTime() == date.getTime())
                .map(filtered => filtered.results)
                .map(d => d[0])

            flowIds.forEach(flowId => {
                const res = ar.filter(d => d.flowId == flowId);
                let count = 0;
                if (res.length > 0) count = res[0].count
                normalizedData[flowId].push(count)
            })


        })
        
        return normalizedData;
    }

    async getAggregatedMetricsFlowByHour(startDate: Date, endDate: Date): Promise<AggregatedMetricsFlowByHour[]> {
        const query = aql`
            FOR m in ${this.arangoService.collection}
            FILTER m.type == "METRIC_FLOW_BY_HOUR"
            FILTER m.date > ${startDate}
            FILTER m.date < ${endDate}
            COLLECT timestamp = m.date into results = { flowId: m.name, count: m.count}

            RETURN {
                timestamp, results
            }
            `;

        return this.arangoService.database.query(query)
            .then(res => res.all())
            .catch(e => {
                this.logger.error(e)
                throw new HttpException(e.response.body.errorMessage, e.code)
            })
    }

    async removeMetricsByDate(endDate: Date) {
        const query = aql`
            FOR m in ${this.arangoService.collection}
            FILTER m.date < ${endDate}
            
            COLLECT WITH count into count
            RETURN count
            `;
        return this.arangoService.database.query(query)
            .then(res => res.all())
            .catch(e => {
                this.logger.error(e)
                throw new HttpException(e.response.body.errorMessage, e.code)
            })
    }

    getActiveTracks(): ActiveTrack[] {
        return this.clientService.getActiveTracks();
    }

    getActiveClientsByFlows(): ActiveClientsByFlows[] {
        return this.clientService.getActiveClientsByFlows();
    }

    getAggregatedSessionsByLocation(startDate?: Date, endDate?: Date): Promise<AggregatedSessionByLocation[]> {
        return this.sessionService.getAggregatedSessionsByLocation(startDate, endDate);
    }

    getAggregatedSessionsByBrowser(startDate?: Date, endDate?: Date): Promise<AggregatedSessionByBrowser[]> {
        return this.sessionService.getAggregatedSessionsByBrowser(startDate, endDate);
    }

    getAggregatedSessionsByOS(startDate?: Date, endDate?: Date): Promise<AggregatedSessionByOS[]> {
        return this.sessionService.getAggregatedSessionsByOS(startDate, endDate);
    }

    getAggregatedTracksByFlowId(startDate?: Date, endDate?: Date): Promise<AggregatedTrackByFlowId[]> {
        return this.trackService.getAggregatedTracksByFlowId(startDate, endDate);
    }
}
