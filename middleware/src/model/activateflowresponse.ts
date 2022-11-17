import { ApiProperty } from "@nestjs/swagger";

export class ActivateFlowResponse {
    @ApiProperty()
    tid: string;
}