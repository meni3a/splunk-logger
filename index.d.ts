export declare class SplunkLogger {
    constructor(url: String, token: String);
    private options;
    private send;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    fatal(message: string): void;
    debug(message: string): void;
}
