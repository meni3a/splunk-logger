# splunk-logger

splunk-logger is a JavaScript library for dealing with sending logs to splunk.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/splunk-logger) to install splunk-logger.

```bash
npm install splunk-logger
```

## Usage

```js
import SplunkLogger from 'splunk-logger'

let log = new SplunkLogger("http://127.0.0.1:8088/services/collector/event","s87dfd-df76d-df6f-87fg-dfg87f8g7g")

log.info("server started")

```



## License
[MIT](https://choosealicense.com/licenses/mit/)