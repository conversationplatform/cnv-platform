import { ApiProperty } from "@nestjs/swagger";

export class Interaction {

    @ApiProperty()
    sid?: string;

    @ApiProperty()
    tid: string;

    @ApiProperty()
    flowId: string;
    
    @ApiProperty()
    origin: OriginInteraction;

    @ApiProperty()
    data?: any;

    @ApiProperty()
    timestamp: Date;

    constructor(tid: string, flowId: string, origin: OriginInteraction, data: any, timestamp: Date = new Date()) {
        this.tid = tid;
        this.flowId = flowId;
        this.origin = origin;
        this.data = data;
        this.timestamp = timestamp;
    }
}

export enum OriginInteraction {
    SERVER = 'server',
    CLIENT = 'client'
}