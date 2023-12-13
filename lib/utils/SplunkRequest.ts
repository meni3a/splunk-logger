export class SplunkRequest {
    constructor(request: Partial<SplunkRequest>) {
        Object.assign(this, request);
    }
    url!: string;
    method!:'GET'|'POST'|'PUT'|'DELETE'
    headers!: object;
    body!: string;

}
