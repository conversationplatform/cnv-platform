import { ApiProperty } from "@nestjs/swagger";

export class CPU {
    
    @ApiProperty()
    architecture: string;
}