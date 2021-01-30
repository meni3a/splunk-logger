
# splunk-logger
  

splunk-logger is a JavaScript library for dealing with sending logs to splunk.

  

## Installation

  

Use the package manager [npm](https://www.npmjs.com/package/splunk-logger) to install splunk-logger.

  

```bash
npm install splunk-logger
```
ES6:
```js
import SplunkLogger from 'splunk-logger'
```
CommonJS:

 ```js
var SplunkLogger = require('splunk-logger').SplunkLogger
```

## Usage

  
```js
import SplunkLogger from 'splunk-logger'

const URL = "http://127.0.0.1:8088/services/collector/event"
const TOKEN = "87dfd-df76d-df6f-87fg-dfg87f8g7g"

const log = new SplunkLogger(URL,TOKEN)

log.info("server started")

```
You can expect the console to print:
```
12:31:12 - INITIAL - Logger initialed
```
In case of error, please check if your Splunk settings and make sure your token and address are correct.

## Console write
By default, Splunk-logger will print your logs to the console as well:

```
12:31:12 - INFO - server started
12:31:17 - ERROR - your error message
```
You can disable the above option by setting isLogsPrinted to false:

```js
log.isLogsPrinted = false
```


## Log levels

 - info
 - warn
 - error
 - fatal
 - debug

  
  
  

## License

[MIT](https://choosealicense.com/licenses/mit/)