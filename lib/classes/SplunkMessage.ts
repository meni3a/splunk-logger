import { LogLevel } from "../enums/LogType";

export class SplunkMessage {
    constructor(type: LogLevel, message: any) {
        this.type = type;
        this.message = message;
    }
    type: LogLevel;
    message: any;
}
