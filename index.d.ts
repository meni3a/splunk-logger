export declare class SplunkLogger {
    constructor(url: String, token: String);
    private writeLog;
    private options;
    private isFirstLog;
    isLogsPrinted: boolean;
    private send;
    private initial;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    fatal(message: string): void;
    debug(message: string): void;
}
