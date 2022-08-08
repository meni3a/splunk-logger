const fetch = require('node-fetch');


class HttpRequest {
    constructor(url: string, method: string, headers: object, body: any) {
        this.url = url
        this.method = method
        this.headers = headers
        this.body = body
    }
    url: string
    method: string
    headers: object
    body: any

}
class SplunkMessage {
    constructor(type: LogType, message: any) {
        this.type = type
        this.message = message
    }
    type: LogType;
    message: any
}
class SplunkPayload {
    constructor(type: LogType, message: any) {
        this.event = new SplunkMessage(type, message)
    }

    event: SplunkMessage
}

enum Colors {
    Regular = "\u001b[1;0m",
    Red = "\u001b[1;31m",
    Green = "\u001b[1;32m",
    Yellow = "\u001b[1;33m",
    Cyan = "\u001b[1;36m"
}

enum LogType {
    ERROR = "ERROR",
    INFO = "INFO",
    WARN = "WARN",
    FATAL = "FATAL",
    DEBUG = "DEBUG",
    INITIAL = "INITIAL"
}

const LogTypeToColor = {
    [LogType.ERROR]: Colors.Red,
    [LogType.INFO]: Colors.Green,
    [LogType.WARN]: Colors.Yellow,
    [LogType.FATAL]: Colors.Red,
    [LogType.DEBUG]: Colors.Cyan,
    [LogType.INITIAL]: Colors.Regular
}

export class SplunkLogger {

    constructor(url: String, token: String) {
        this.queue = [];
        this.processing = false;
        this.fn = fetch;

        this.url = url
        this.token = token
        this.initial()
    }

    private processing: boolean;
    private queue: HttpRequest[];
    private fn: Function;

    private url: String;
    private token: String;

    public isLogsPrinted: boolean = true
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

                if (this.isLogsPrinted) {
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


}
