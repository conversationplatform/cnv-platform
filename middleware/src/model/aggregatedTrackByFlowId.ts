import { ApiProperty } from "@nestjs/swagger";

export class AggregatedTrackByFlowId {

    @ApiProperty()
    name: string;

    @ApiProperty()
    count: number;
}