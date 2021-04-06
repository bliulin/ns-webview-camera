import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { empty, Observable } from "rxjs";

class HttpHandlerFake extends HttpHandler {
    public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return empty();
    }
}

export class HttpClientFake extends HttpClient {
    constructor() {
        super(new HttpHandlerFake());
    }
}
