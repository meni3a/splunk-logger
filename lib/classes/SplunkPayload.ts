import { SplunkMessage } from "./SplunkMessage";
import { LogLevel } from "../enums/LogType";

export class SplunkPayload {
    constructor(type: LogLevel, message: any) {
        this.event = new SplunkMessage(type, message);
    }

    event: SplunkMessage;
}
