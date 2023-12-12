export class HttpRequest {
    constructor(request: Partial<HttpRequest>) {
        Object.assign(this, request);
    }
    url!: string;
    method!:'GET'|'POST'|'PUT'|'DELETE'
    headers!: object;
    body!: string;

}
