export class HttpRequest {
    constructor(url: string, method: string, headers: object, body: any) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
    url: string;
    method: string;
    headers: object;
    body: any;

}
