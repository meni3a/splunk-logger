import { LogType } from "./enums/LogType";

export class SplunkMessage {
    constructor(type: LogType, message: any) {
        this.type = type;
        this.message = message;
    }
    type: LogType;
    message: any;
}
