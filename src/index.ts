import request = require('request');


export class SplunkLogger{

    constructor(url:String,token:String) {
        this.options.headers.Authorization = `Splunk ${token}`
        this.options.url = url.toString()
        
        this.initial()
    }

    private writeLog:boolean = true

    private options = {
        'method': 'POST',
        'url': '',
        'headers': {
          'Authorization': '',
        },
        body: ''
      
      };

      private isFirstLog:boolean = true
      public isLogsPrinted:boolean = true

      private send(type:string, message:string){
        let payload = {
            event: {
                message: message,
                type: type
            }
        }
        this.options.body = JSON.stringify(payload)
        
        const self = this
        request(this.options, function (error, response) {
            if (error){
                console.log("SplunkLogger Error: ",error)
            }
            else{
                const result = JSON.parse(response?.body)
                if(result?.code == 0){
                    if(self.isFirstLog){
                        console.log("Logger is initial successfully")
                        self.isFirstLog = false
                    }
                    else{
                        if(self.isLogsPrinted)
                        console.log(`${new Date().toISOString().substr(11, 8)} | ${type} | ${message}`)
                    }
                }
                else if(result?.code != 0){
                    console.log("SplunkLogger Error: " + result?.text)
                }
                else{
                    console.log("SplunkLogger: Unexpected response")
                }
            }

        });

      
    }
    private initial(){this.send("initial","Logger initialed")}

    public error(message:string){ this.send("error",message)}

    public info(message:string){ this.send("info",message)}

    public warn(message:string) { this.send("warn",message)}
    
    public fatal(message:string) { this.send("fatal",message)}

    public debug(message:string) { this.send("debug",message)}


}

