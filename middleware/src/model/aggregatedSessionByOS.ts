import { ApiProperty } from "@nestjs/swagger";

export class AggregatedSessionByOS {
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    count: number;
}