import { Colors } from "../enums/Colors";
import { HttpRequest } from "../utils/HttpRequest";
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

        this.url = `${this.options.ssl?'https':'http'}://${this.options.domain}:${this.options.port}/services/collector`;

        this.initial();
    }


    private options!: SplunkLoggerOptions;
    private processing: boolean;
    private queue: HttpRequest[];
    private fetchMethod: Function;
    private url: String;



    async executeFromQueue(): Promise<void> {

        while (!this.processing && this.queue.length) {

            this.processing = true;

            const requests = this.queue.splice(0, this.options.numOfParallelRequests);
            const promises = requests.map(request => this.processRequest(request));
            
            await Promise.all(promises);
            
            this.processing = false;
        }

    }

    private async processRequest(request: HttpRequest) {
        try {

            const payload = <SplunkPayload>(request?.body);
            if (request != null) {
                request.body = JSON.stringify(payload);

            }

            const response = await this.fetchMethod(request?.url, request);
            const result = await response.json();

            if (result?.code == 0) {

                if (this.options.shouldPrintLogs) {
                    let color = LogTypeToColor[payload.event.type];
                    const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${payload.event.type} ${Colors.Regular} - ${JSON.stringify(payload.event.message)}`;
                    console.log(log);
                }

            }
            else {
                console.log("SplunkLogger Error: " + result?.text);
            }
        }
        catch (err) {
            console.log("SplunkLogger Fail: ", err);
        }
    }

    private handleLog(type: LogLevel, message: any) {

        const headers = { Authorization: `Splunk ${this.options.token}` };
        const body = { type, message };
        const request = new HttpRequest(this.url.toString(), "POST", headers, body);

        if (this.options.isQueueMode) {
            this.queue.push(request);
            this.executeFromQueue();
        }
        else {
            this.processRequest(request);
        }

    }


    private initial() { this.handleLog(LogLevel.INITIAL, "Logger initialed"); }

    public error(message: any) { this.handleLog(LogLevel.ERROR, message); }

    public info(message: any) { this.handleLog(LogLevel.INFO, message); }

    public warn(message: any) { this.handleLog(LogLevel.WARN, message); }

    public fatal(message: any) { this.handleLog(LogLevel.FATAL, message); }

    public debug(message: any) { this.handleLog(LogLevel.DEBUG, message); }



}
