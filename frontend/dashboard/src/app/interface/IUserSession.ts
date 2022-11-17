import { IBrowser } from "./browser.interface";
import { ICPU } from "./CPU.interface";
import { IOperatingSystem } from "./operatingsystem.interface";


export interface IUserSession {
    _key?: string;
    _id?: string;
    sid: string;
    userAgent: string;
    browser: IBrowser;
    operatingSystem: IOperatingSystem
    cpu: ICPU
    userIp: string;
    country: string;
    city: string;
    createDate: Date;
}