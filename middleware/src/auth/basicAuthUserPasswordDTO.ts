import { ApiProperty } from "@nestjs/swagger";

export class BasicAuthUserPasswordDTO {
    @ApiProperty()
    user: string;

    @ApiProperty()
    password: string;

    constructor() {
        this.user = '';
        this.password = '';
    }
}