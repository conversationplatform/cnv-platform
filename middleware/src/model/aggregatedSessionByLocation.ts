import { ApiProperty } from "@nestjs/swagger";

export class AggregatedSessionByLocation {

    @ApiProperty()
    country: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    count: number;
}