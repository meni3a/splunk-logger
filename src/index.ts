import request = require('request');


export class SplunkLogger{

    constructor(url:String,token:String) {
        this.options.headers.Authorization = `Splunk ${token}`;
        this.options.url = url.toString();
    }

    private options = {
        'method': 'POST',
        'url': '',
        'headers': {
          'Authorization': '',
        },
        body: ''
      
      };

      private send(type:string, message:string){
        var payload = {
            event: {
                message: message,
                type: type
            }
        }
        this.options.body = JSON.stringify(payload);
        request(this.options, function (error, response) {
            if (error){
                console.log("SplunkLogger Error: ",error);
            }
            else{
                const result = JSON.parse(response?.body)
                if(result?.code == 0){
                    console.log(result?.text)
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

    public error(message:string){ this.send("error",message)}

    public info(message:string){ this.send("info",message)}

    public warn(message:string) { this.send("warn",message)}
    
    public fatal(message:string) { this.send("fatal",message)}

    public debug(message:string) { this.send("debug",message)}


}

