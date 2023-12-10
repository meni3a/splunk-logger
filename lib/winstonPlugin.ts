import Transport from "winston-transport";
import { SplunkLogger } from ".";


const PROCESS_ID = process.pid;


export class SplunkStreamEvent extends Transport {
	server: SplunkLogger;

	constructor(config: { token: string | undefined; url: string | undefined }) {
		super();

		if (!config || !config.token || !config.url) {
			console.info("Invalid Configuration: config is invalid " + JSON.stringify(config));
			throw new Error();
		}

		this.server = new SplunkLogger(config.url, config.token);
	}

	async log(info: any, callback: any) {
		const self = this;
		let level: string = info[Symbol.for("level")] as string;
		const msg = { ...info, source: PROCESS_ID };
		const meta = Object.assign({}, info);
		delete meta[Symbol.for("level")];
		delete meta[Symbol.for("message")];

		const logLevel = level as LogLevel;
		if (logLevel in this.server) {
			this.server[logLevel](msg);
		} else {
			this.server.error("Invalid Log Level: " + logLevel);
		}

		callback();
	}
}

enum LogLevel {
	debug = "debug",
	info = "info",
	warn = "warn",
	error = "error",
	fatal = "fatal",
	initial = "initial",
}