import { Colors } from "./enums/Colors";
import { HttpRequest } from "./HttpRequest";
import { LogType } from "./enums/LogType";
import { LogTypeToColor } from "./LogTypeToColor";
import { SplunkPayload } from "./SplunkPayload";
import fetch from 'node-fetch';

export class SplunkLogger {

    constructor(options:{domain: string, token:string, shouldPrintLogs?:boolean, isQueueMode?:boolean}) {
        this.queue = [];
        this.processing = false;
        this.fn = fetch;

        this.url = `https://${options.domain}/services/collector`
        this.token = options.token
        this.shouldPrintLogs = options.shouldPrintLogs ?? true
        this.isQueueMode = options.isQueueMode ?? false
        this.initial()
    }

    

    private processing: boolean;
    private queue: HttpRequest[];
    private fn: Function;

    private url: String;
    private token: String;

    public shouldPrintLogs: boolean = true
    public isQueueMode:boolean = false

    async run() :Promise<void> {

        while (!this.processing && this.queue.length) {

            this.processing = true;
            const request = this.queue.shift();
            
            if(request){
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
                    let color = LogTypeToColor[payload.event.type]
                    const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${payload.event.type} ${Colors.Regular} - ${JSON.stringify(payload.event.message)}`
                    console.log(log)
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

    private send(type:LogType, message:any){

        const headers = {Authorization:`Splunk ${this.token}`}
        const body = new SplunkPayload(type,message);
        const request = new HttpRequest(this.url.toString(),"POST",headers, body);

        if(this.isQueueMode){
            this.queue.push(request);
            this.run();
        }
        else{
            this.processRequest(request);
        }

    }


    private initial() { this.send(LogType.INITIAL, "Logger initialed") }

    public error(message: any) { this.send(LogType.ERROR, message) }

    public info(message: any) { this.send(LogType.INFO, message) }

    public warn(message: any) { this.send(LogType.WARN, message) }

    public fatal(message: any) { this.send(LogType.FATAL, message) }

    public debug(message: any) { this.send(LogType.DEBUG, message) }
    
    public http(message: any) { this.send(LogType.HTTP, message) }

}
