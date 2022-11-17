import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Browser } from './Browser';
import { CPU } from './CPU';
import { OperatingSystem } from './operatingsystem';


export class UserSession {
    _key?: string;
    _id?: string;
    
    @ApiProperty()
    sid: string;

    @ApiProperty()
    userAgent: string;

    @ApiProperty()
    browser: Browser

    @ApiProperty()
    operatingSystem: OperatingSystem

    @ApiProperty()
    cpu: CPU

    userIp: string;

    @ApiProperty()
    createDate: Date;

    @ApiProperty()
    country: string;

    @ApiProperty()
    city: string;


    constructor(
        userAgent: string,
        browser: Browser,
        cpu: CPU,
        operatingSystem: OperatingSystem,

        country: string,
        city: string) {

        this.sid = uuidv4();
        this.userAgent = userAgent;
        this.createDate = new Date();

        this.browser = browser;
        this.cpu = cpu;
        this.operatingSystem = operatingSystem;
        this.country = country;
        this.city = city;

    }

}