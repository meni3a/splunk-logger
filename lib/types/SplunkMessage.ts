import { LogLevel } from "../enums/LogType";

export type SplunkMessage = {
    type: LogLevel;
    message: any;
}
