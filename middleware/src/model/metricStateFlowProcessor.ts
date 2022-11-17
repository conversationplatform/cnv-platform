export class MetricStateFlowProcessor {
    lastProcessedTimestamp: Date;

    constructor(lastProcessedTimestamp: Date) {
        this.lastProcessedTimestamp = lastProcessedTimestamp;
    }
}