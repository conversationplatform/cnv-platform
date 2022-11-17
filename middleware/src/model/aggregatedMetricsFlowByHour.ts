export class AggregatedMetricsFlowByHour {
    timestamp: Date;
    results: {
        flowId: string;
        count: number
    }[]
}