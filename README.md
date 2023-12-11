
# splunk-logger
  
splunk-logger is a robust and efficient JavaScript library designed to streamline the process of sending logs to Splunk. It provides a simple yet powerful interface for log management.
  

## Installation

  

Use the package manager [npm](https://www.npmjs.com/package/splunk-logger) to install splunk-logger.

  
```bash
npm install splunk-logger
```


## Usage

  
```js
import { SplunkLogger } from "splunk-logger";

const logger = new SplunkLogger({
    token: "your token",
    domain: "your splunk host",
});

logger.info('server is running on port 3000');
```

### Use with Winston logger
```js
import * as winston from "winston";
import { SplunkLogger } from "splunk-logger";
import { SplunkWinstonTransport } from "splunk-logger";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new SplunkWinstonTransport({
            token: "your token",
            domain: "your splunk host",
        })
    ]
});
```

### Full options object
```js
const options = new SplunkLoggerOptions({
    domain: "localhost",
    port: 8088,
    ssl: false,
    token: "00000000-0000-0000-0000-000000000000",
    shouldPrintLogs: true,
    isQueueMode: false,
    numOfParallelRequests: 100
});

const logger = new SplunkLogger(options)
```
You can expect the console to print:
```
12:31:12 - INITIAL - Logger initialed
```
In case of error, please check if your Splunk settings and make sure your token and address are correct.


## Log levels

 - info
 - warn
 - error
 - fatal
 - debug

  


## License

[MIT](https://choosealicense.com/licenses/mit/)