import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Interaction } from './client.interaction';

export class ClientTrack {
    _key?: string;
    _id?: string;

    @ApiProperty()
    sid: string;

    @ApiProperty()
    tid: string;

    @ApiProperty()
    flowId: string;

    @ApiProperty()
    date: Date;

    // @ApiProperty({
    //     type: [Interaction]
    // })
    interaction?: Interaction[]

    @ApiProperty()
    interactionSize?: number;
    
    @ApiProperty()
    store?: Object;
    
    @ApiProperty()
    storeSize?: number

    constructor(sid: string, flowId: string) {
        this.sid = sid;
        this.tid = uuidv4();
        this.flowId = flowId;
        this.date = new Date();
        this.store = {};

    }
}