import { ApiProperty } from "@nestjs/swagger";

export class CustomProperties {
    @ApiProperty()
    cors: string;

    @ApiProperty()
    NODERED_ENABLE_PROJECTS: boolean;

    @ApiProperty()
    TRACK_LIFETIME_MONTHS: number;

    @ApiProperty()
    SESSION_COOKIE_NAME: string;

    @ApiProperty()
    NODERED_ENABLE_PALLETE: boolean;
}