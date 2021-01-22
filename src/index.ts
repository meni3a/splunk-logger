const request = require('request')



export class SplunkLogger{

    constructor(url:String,token:String) {
        this.options.headers.Authorization = `Splunk ${token}`
        this.options.url = url.toString()
        
        this.initial()
    }

    private colors = {
        regular: "\u001b[1;0m",
        red: "\u001b[1;31m",
        green: "\u001b[1;32m",
        yellow: "\u001b[1;33m",
        cyan: "\u001b[1;36m"
        
    }

    private options = {
        'method': 'POST',
        'url': '',
        'headers': {
          'Authorization': '',
        },
        body: ''
      
      }

      private isFirstLog:boolean = true
      public isLogsPrinted:boolean = true

      private send(type:string, message:any){
        let payload = {
            event: {
                message: message,
                type: type
            }
        }
        this.options.body = JSON.stringify(payload)
        
        const self = this
        request(this.options, function (error:Error, response:any) {
            if (error){
                console.log("SplunkLogger Error: ",error)
            }
            else{
                const result = JSON.parse(response?.body)
                if(result?.code == 0){
                    if(self.isFirstLog){
                        console.log("Logger initialed successfully")
                        self.isFirstLog = false
                    }
                    else{

                        if(self.isLogsPrinted){
                            let color = self.colors.regular
                            switch(type){
                                case "ERROR":
                                    color = self.colors.red
                                    break
                                case "INFO":
                                    color = self.colors.green
                                    break
                                case "WARN":
                                    color = self.colors.yellow
                                    break
                                case "FATAL":
                                    color = self.colors.red
                                    break
                                case "DEBUG":
                                    color = self.colors.cyan
                                    break 
                                default:
                                    break;                                
                                
                            }

                            const log = `${new Date().toISOString().substr(11, 8)} - ${color} ${type} ${self.colors.regular} - ${JSON.stringify(message)}`
                            console.log(log)
                       
                        }

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
    private initial(){this.send("INITIAL","Logger initialed")}

    public error(message:any){ this.send("ERROR",message)}

    public info(message:any){ this.send("INFO",message)}

    public warn(message:any) { this.send("WARN",message)}
    
    public fatal(message:any) { this.send("FATAL",message)}

    public debug(message:any) { this.send("DEBUG",message)}


}