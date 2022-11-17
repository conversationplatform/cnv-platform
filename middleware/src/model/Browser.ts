import { ApiProperty } from "@nestjs/swagger";

export class Browser {
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    version: string;
}