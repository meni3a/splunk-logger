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
                `QueueMode is designed to batch a specified number of logs and send them in a single HTTP request to Splunk.\n` +
                `This approach effectively reduces the number of HTTP requests and minimizes event loop activity.\n\n` +
                `Key Points:\n` +
                `1. Efficient Logging: By batching logs, QueueMode reduces the frequency of HTTP requests, enhancing performance.\n` +
                `2. Event Loop Impact: Reduced HTTP requests mean less strain on the event loop, contributing to smoother operation.\n` +
                `3. Memory Management: You can limit the queue size in QueueMode, preventing memory leaks.\n\n` +
                `Recommendation:\n` +
                `Use QueueMode to optimize logging performance, especially in high-traffic environments. It's a powerful tool\n` +
                `for efficient log management when configured correctly with an appropriate queue size limit.\n\n` +
                `Note: Ensure proper configuration of QueueMode to balance performance and resource utilization.\n` +
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