import { HttpErrorResponse } from '@angular/common/http';

export class NoConnectivityError extends HttpErrorResponse {
    constructor() {
        super({
            status: 0,
            statusText: 'NoInternet'
        });
    }
}
