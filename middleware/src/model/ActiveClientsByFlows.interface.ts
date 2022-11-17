import { ApiProperty } from "@nestjs/swagger";

export class ActiveClientsByFlows {
    
    @ApiProperty()
    flowId: string;

    @ApiProperty()
    numClients: number;
}