import { SplunkMessage } from "./SplunkMessage";
import { LogType } from "./enums/LogType";

export class SplunkPayload {
    constructor(type: LogType, message: any) {
        this.event = new SplunkMessage(type, message);
    }

    event: SplunkMessage;
}
