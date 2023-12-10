import Transport from "winston-transport";
import { SplunkLogger } from "./SplunkLogger";
import { SplunkLoggerOptions } from "./SplunkLoggerOptions";


const PROCESS_ID = process.pid;


export class SplunkWinstonTransport extends Transport {
	splunk: SplunkLogger;

	constructor(options: SplunkLoggerOptions) {
		super();

		if (!options || !options.token || !options.domain) {
			console.info("Invalid Configuration: config is invalid " + JSON.stringify(options));
			throw new Error();
		}

		this.splunk = new SplunkLogger(options);
	}

	async log(info: any, callback: any) {
		const self = this;
		let level: string = info[Symbol.for("level")] as string;
		const msg = { ...info, source: PROCESS_ID };
		const meta = Object.assign({}, info);
		delete meta[Symbol.for("level")];
		delete meta[Symbol.for("message")];

		const logLevel = level as any;
		if (logLevel in this.splunk) {
			(this.splunk as any)[logLevel.toLocaleLowerCase()](msg);
		} else {
			this.splunk.error("Invalid Log Level: " + logLevel);
		}

		callback();
	}
}
