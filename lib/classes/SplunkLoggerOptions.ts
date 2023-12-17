export class SplunkLoggerOptions {
    constructor(obj?: Partial<SplunkLoggerOptions>) {
        if (obj) {
            Object.assign(this, obj);
        }
        if (this.shouldPrintLogs == undefined) {
            this.shouldPrintLogs = this.isWinstonTransport ? false : true;
        }
    }
    domain!: string;
    port?: number = 8088;
    ssl?: boolean = true;
    token!: string;
    shouldPrintLogs?: boolean;
    isBatchingEnabled?: boolean = false;
    batchOptions?: BatchOptions;

    private isWinstonTransport?: boolean = false;
}