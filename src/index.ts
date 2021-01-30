const fetch = require('node-fetch');


class httpRequest {
    constructor(url:string,method:string,headers:object,body:any){
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
class splunkMessage{
    constructor(type?: string,message?:any){
        this.type = type 
        this.message = message
    }
    type: string | undefined;
    message:any
}
class splunkPayload{
    constructor(type?: string,message?:any){
        this.event = new splunkMessage(type, message)
    }
    
    event:splunkMessage
}

export class SplunkLogger{

    constructor(url:String,token:String) {
        this.queue = [];
        this.processing = false;
        this.fn = fetch;

        this.url = url
        this.token = token
        this.initial()
    }

    private processing: boolean;
    private queue: httpRequest[];
    private fn: Function;

    private url: String;
    private token: String;

    private colors = {
        regular: "\u001b[1;0m",
        red: "\u001b[1;31m",
        green: "\u001b[1;32m",
        yellow: "\u001b[1;33m",
        cyan: "\u001b[1;36m"
        
    }


    public isLogsPrinted:boolean = true

    async run() {
        
        while (!this.processing && this.queue.length) {
            try {
                this.processing = true;
                let request = this.queue.shift()  

                const payload = <splunkPayload>(request?.body);
                if(request!=null){   
                    request.body =JSON.stringify(payload)

                }

                const response = await this.fn(request?.url,request)       
                const result = await response.json();

                if(result?.code == 0){

                    if(this.isLogsPrinted){
                        let color = this.colors.regular
                        switch(payload.event.type){
                            case "ERROR":
                                color = this.colors.red
                                break 
                            case "INFO":
                                color = this.colors.green
                                break
                            case "WARN":
                                color = this.colors.yellow
                                break
                            case "FATAL":
                                color = this.colors.red
                                break
                            case "DEBUG":
                                color = this.colors.cyan
                                break 
                            case "INITIAL":
                                color = this.colors.cyan
                                break 
                            default:
                                break;                                
                            
                        }

                        const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${payload.event.type} ${this.colors.regular} - ${JSON.stringify(payload.event.message)}`
                        console.log(log)
                
                    }

                }
                else{
                    console.log("SplunkLogger Error: " + result?.text)
                }
            }
            catch(err) {
                console.log("SplunkLogger Fail: ",err)
            } 
            finally{
                this.processing = false;
            }
        }

    }
     

    private send(type:string, message:any){

        const headers = {Authorization:`Splunk ${this.token}`}
        const body = new splunkPayload(type,message)
        const request = new httpRequest(this.url.toString(),"POST",headers, body)

        this.queue.push(request)

        this.run()
    }


    private initial(){this.send("INITIAL","Logger initialed")}

    public error(message:any){ this.send("ERROR",message)}

    public info(message:any){ this.send("INFO",message)}

    public warn(message:any) { this.send("WARN",message)}
    
    public fatal(message:any) { this.send("FATAL",message)}

    public debug(message:any) { this.send("DEBUG",message)}


}
