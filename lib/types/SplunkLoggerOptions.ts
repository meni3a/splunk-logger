export type SplunkLoggerOptions = { 
    domain: string;
    ssl: boolean;
    token: string;
    shouldPrintLogs?: boolean;
    isQueueMode?: boolean;
}