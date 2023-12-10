export class SplunkLoggerOptions {
    constructor(obj?: Partial<SplunkLoggerOptions>) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    domain!: string;
    port?: number = 8088;
    ssl?: boolean = true;
    token!: string;
    shouldPrintLogs?: boolean = true;
    isQueueMode?: boolean = false;
}