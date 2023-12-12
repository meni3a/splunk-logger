export class SplunkLoggerOptions {
    constructor(obj?: Partial<SplunkLoggerOptions>) {
        if (obj) {
            Object.assign(this, obj);
        }
        if (this.shouldPrintLogs == undefined) {
            this.shouldPrintLogs = this.isWinstonTransport ? false : true;
        }
        if(this.isQueueMode){
            console.log(
                `--------------------------------------------------------------------------------\n` +
                `SplunkLogger WARNING\n` +
                `--------------------------------------------------------------------------------\n\n` +
                `Description:\n` +
                `QueueMode offers benefits such as reduced network activity and alleviated event loop pressure.\n` +
                `However, it is important to be aware of its potential drawbacks:\n\n` +
                `1. Memory Leak Risk: There's an inherent risk of memory leakage when using QueueMode.\n` +
                `2. Delay in Log Processing: Logs might experience delays, affecting real-time data analysis.\n\n` +
                `Recommendation:\n` +
                `QueueMode should be used judiciously. It is suitable for advanced users who understand\n` +
                `the implications and can manage the associated risks effectively.\n\n` +
                `Note: Proceed with QueueMode only if you are confident in handling its intricacies.\n` +
                `--------------------------------------------------------------------------------`
            );
        }
    }
    domain!: string;
    port?: number = 8088;
    ssl?: boolean = true;
    token!: string;
    shouldPrintLogs?: boolean;
    isQueueMode?: boolean = false;
    numOfParallelRequests?: number = 100;
    maxQueueSize?: number;
    private isWinstonTransport?: boolean = false;
}