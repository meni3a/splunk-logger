import {ConsoleColors} from "../enums/ConsoleColors";
import {SplunkRequest} from "./SplunkRequest";
import {LogLevel} from "../enums/LogType";
import {LogTypeToColor} from "../utils/LogTypeToColor";
import {SplunkPayload} from "../types/SplunkPayload";
import {SplunkLoggerOptions} from "./SplunkLoggerOptions";


export class SplunkLogger{ 

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
    private processing: boolean;
    private queue: SplunkPayload[];
    private fetchMethod: Function;
    private splunkRequest!: SplunkRequest;

    private createSplunkRequest() {
        const url = `${this.options.tls ? 'https' : 'http'}://${this.options.domain}:${this.options.port}/services/collector`;
        const headers = { Authorization: `Splunk ${this.options.token}` };


        return new SplunkRequest({
            url: url.toString(),
            headers
        });
    }

    private async executeFromQueue(): Promise<void> {

        while (!this.processing && this.queue.length) {

            this.processing = true;

            const requests = this.queue.splice(0, this.options.batchOptions?.batchSize ?? 200);
            
            await this.processRequest(requests);
            
            this.processing = false;
        }

    }

    private async processRequest(data: SplunkPayload[]) {
        try {
            const response = await this.fetchMethod(this.splunkRequest.url, {
                method: this.splunkRequest.method,
                headers: this.splunkRequest.headers,
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result?.code !== 0) {
                console.log("SplunkLogger Error: " + result?.text);
            }
        }
        catch (err) {
            console.log("SplunkLogger Fail: ", err);
        }
    }

    private handleLog(type: LogLevel, message: any):void {

        const splunkPayload:SplunkPayload = type === LogLevel.RAW ? message : {event:{ type, message }};

        if (this.options.shouldPrintLogs) {
            let color = LogTypeToColor[type];
            const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${type} ${ConsoleColors.Regular} - ${JSON.stringify(message)}`;
            console.log(log);
        }
    

        if (this.options.isBatchingEnabled) {
            if(this.queue.length <= (this.options.batchOptions?.queueSizeLimit ?? 2000)){
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
    public raw(message: any) { this.handleLog(LogLevel.RAW, message); }
}
