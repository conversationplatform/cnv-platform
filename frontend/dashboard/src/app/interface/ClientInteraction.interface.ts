import { EClientOriginInteraction } from "../enum/ClientOriginInteraction.interface";

export interface IClientInteraction {
    _id: string;
    _key: string;
    origin: EClientOriginInteraction;
    data: any;
    timestamp: Date;
    tid: string;
    flowId: string;
}