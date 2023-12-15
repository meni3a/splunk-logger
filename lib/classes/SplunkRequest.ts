export class SplunkRequest {
    constructor(request: Partial<SplunkRequest>) {
        Object.assign(this, request);
    }
    url!: string;
    method:string = 'POST';
    headers!: object;
    body!: string;

}
