import { Colors } from "../enums/Colors";
import { HttpRequest } from "../utils/HttpRequest";
import { LogLevel } from "../enums/LogType";
import { LogTypeToColor } from "../utils/LogTypeToColor";
import { SplunkPayload } from "./SplunkPayload";
import { SplunkLoggerOptions } from "./SplunkLoggerOptions";


export class SplunkLogger {

    constructor(optionsObj: SplunkLoggerOptions) {
        const options = new SplunkLoggerOptions(optionsObj);
        this.queue = [];
        this.processing = false;

        // check if fetch is available (only in nodejs 18+), if not, use node-fetch
        if (typeof fetch === "undefined") {
            const nodeFetch = require('node-fetch');
            this.fn = nodeFetch;
        }
        else{
            this.fn = fetch;
        }

        this.url = `${options.ssl?'https':'http'}://${options.domain}:${options.port}/services/collector`;
        this.token = options.token;

        this.initial();
    }



    private processing: boolean;
    private queue: HttpRequest[];
    private fn: Function;

    private url: String;
    private token: String;

    public shouldPrintLogs: boolean = true;
    public isQueueMode: boolean = false;

    async run(): Promise<void> {

        while (!this.processing && this.queue.length) {

            this.processing = true;
            const request = this.queue.shift();

            if (request) {
                await this.processRequest(request);
            }

            this.processing = false;
        }

    }

    private async processRequest(request: HttpRequest) {
        try {

            const payload = <SplunkPayload>(request?.body);
            if (request != null) {
                request.body = JSON.stringify(payload);

            }

            const response = await this.fn(request?.url, request);
            const result = await response.json();

            if (result?.code == 0) {

                if (this.shouldPrintLogs) {
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

    private send(type: LogLevel, message: any) {

        const headers = { Authorization: `Splunk ${this.token}` };
        const body = new SplunkPayload(type, message);
        const request = new HttpRequest(this.url.toString(), "POST", headers, body);

        if (this.isQueueMode) {
            this.queue.push(request);
            this.run();
        }
        else {
            this.processRequest(request);
        }

    }


    private initial() { this.send(LogLevel.INITIAL, "Logger initialed"); }

    public error(message: any) { this.send(LogLevel.ERROR, message); }

    public info(message: any) { this.send(LogLevel.INFO, message); }

    public warn(message: any) { this.send(LogLevel.WARN, message); }

    public fatal(message: any) { this.send(LogLevel.FATAL, message); }

    public debug(message: any) { this.send(LogLevel.DEBUG, message); }



}
