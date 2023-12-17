
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



## QueueMode Overview

### What is QueueMode?

QueueMode is an advanced feature in SplunkLogger designed to optimize logging performance in high-traffic environments. This mode enables the batching of multiple log entries, which are then sent to Splunk in a single HTTP request. This method is highly efficient and beneficial for applications where minimizing the impact on the event loop and reducing network traffic is crucial.

### Benefits

- **Batched Log Entries:** QueueMode batches a specified number of log entries, which are then sent as a single HTTP request. This significantly reduces the total number of HTTP requests made to Splunk.
- **Reduced Event Loop Activity:** By lowering the frequency of HTTP requests, QueueMode minimizes the workload on the event loop, leading to improved application performance.
- **Customizable Queue Size:** Users have the flexibility to set a limit on the queue size, which helps in managing memory usage effectively and preventing potential memory leaks.


### Recommended Usage

QueueMode is particularly useful for applications that generate a large volume of logs and require efficient log management. It should be configured with a careful balance between performance enhancement and resource utilization. 

### Configuration

To enable and configure QueueMode in your application, refer to the following steps:

```js
// Example configuration for QueueMode in SplunkLogger
{
    batchSize: 50, // Number of log entries per batch
    queueSizeLimit: 1000 // Maximum number of entries in the queue
};
```

## Log levels

 - info
 - warn
 - error
 - fatal
 - debug

  


## License

[MIT](https://choosealicense.com/licenses/mit/)