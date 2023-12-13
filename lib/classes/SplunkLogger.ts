import { ConsoleColors } from "../enums/ConsoleColors";
import { SplunkRequest } from "../utils/SplunkRequest";
import { LogLevel } from "../enums/LogType";
import { LogTypeToColor } from "../utils/LogTypeToColor";
import { SplunkPayload } from "../types/SplunkPayload";
import { SplunkLoggerOptions } from "./SplunkLoggerOptions";


export class SplunkLogger { 

    constructor(optionsObj: SplunkLoggerOptions) {
        this.options = new SplunkLoggerOptions(optionsObj);
        this.queue = [];
        this.processing = false;

        // check if fetch is available (only in nodejs 18+), if not, use node-fetch
        if (typeof fetch === "undefined") {
            const nodeFetch = require('node-fetch');
            this.fetchMethod = nodeFetch;
        }
        else{
            this.fetchMethod = fetch;
        }

        this.splunkRequest = this.createSplunkRequest();
    }


    private options!: SplunkLoggerOptions;
    private queueOptions!: QueueModeOptions;
    private processing: boolean;
    private queue: SplunkPayload[];
    private fetchMethod: Function;
    private splunkRequest!: SplunkRequest;

    private createSplunkRequest() {
        const url = `${this.options.ssl ? 'https' : 'http'}://${this.options.domain}:${this.options.port}/services/collector`;
        const headers = { Authorization: `Splunk ${this.options.token}` };


        return new SplunkRequest({
            url: url.toString(),
            method: 'POST',
            headers
        });
    }

    async executeFromQueue(): Promise<void> {

        while (!this.processing && this.queue.length) {

            this.processing = true;

            const requests = this.queue.splice(0, this.queueOptions.batchSize ?? 1000);
            
            await this.processRequest(requests);
            
            this.processing = false;
        }

    }

    private async processRequest(data: SplunkPayload[]) {
        try {
            this.splunkRequest.body = JSON.stringify(data)
            const response = await this.fetchMethod( this.splunkRequest);
            const result = await response.json();

            if (result?.code !== 0) {
                console.log("SplunkLogger Error: " + result?.text);
            }
        }
        catch (err) {
            console.log("SplunkLogger Fail: ", err);
        }
    }

    private handleLog(type: LogLevel, message: any) {


        const splunkPayload:SplunkPayload = {event:{ type, message }};

        if (this.options.shouldPrintLogs) {
            let color = LogTypeToColor[type];
            const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${type} ${ConsoleColors.Regular} - ${JSON.stringify(message)}`;
            console.log(log);
        }
    

        if (this.queueOptions) {
            if(this.queue.length <= (this.queueOptions.queueSizeLimit ?? 1000)){
                this.queue.push(splunkPayload);
            }
            else{
               console.log("SplunkLogger Fail: Queue is full");
            }
            this.executeFromQueue();
        }
        else {
            this.processRequest([splunkPayload]);
        }

    }


    public error(message: any) { this.handleLog(LogLevel.ERROR, message); }

    public info(message: any) { this.handleLog(LogLevel.INFO, message); }

    public warn(message: any) { this.handleLog(LogLevel.WARN, message); }

    public fatal(message: any) { this.handleLog(LogLevel.FATAL, message); }

    public debug(message: any) { this.handleLog(LogLevel.DEBUG, message); }


    setQueueMode(queueOptions:QueueModeOptions){

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
    
        this.queueOptions = queueOptions;
    }



}
