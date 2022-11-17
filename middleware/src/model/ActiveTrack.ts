import { ApiProperty } from "@nestjs/swagger";

export class ActiveTrack {
    
    @ApiProperty()
    date: Date;
    
    @ApiProperty()
    flowId: string;
    
    @ApiProperty()
    sid: string;
    
    @ApiProperty()
    tid: string
}