export class MetricFlowByHour {
    type: string;
    date: Date;
    name: string;
    count: number;

    constructor(date: Date, name: string, count: number) {
        this.type = 'METRIC_FLOW_BY_HOUR';
        this.date = date;
        this.name = name;
        this.count = count;
    }
}