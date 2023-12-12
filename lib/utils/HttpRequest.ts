export class HttpRequest {
    constructor(request:{ url:string, method:'GET'|'POST'|'PUT'|'DELETE', headers:{}, body:any}) {
        Object.assign(this, request);
    }
    url!: string;
    method!: string;
    headers!: object;
    body!: string;

}
