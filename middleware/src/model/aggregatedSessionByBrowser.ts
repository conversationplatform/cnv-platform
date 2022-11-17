import { ApiProperty } from "@nestjs/swagger";

export class AggregatedSessionByBrowser {
    @ApiProperty()
    name: string;
    @ApiProperty()
    count: number;
}