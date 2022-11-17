import { ApiProperty } from "@nestjs/swagger";

export class OperatingSystem {
    @ApiProperty()
    name: string;
    @ApiProperty()
    version: string;
}