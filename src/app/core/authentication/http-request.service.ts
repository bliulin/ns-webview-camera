import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import * as appSettings from 'tns-core-modules/application-settings';
import { Profile } from '~/app/shared/constants';
import { OmroSessionService } from '~/app/core/services/omro-session.service';

interface IHeaders {
    name: string;
    value: string;
}

@Injectable()
export class HttpRequestService {
    constructor(private authService: AuthenticationService, private sessionService: OmroSessionService) {}

    public getStandardRequestHeaders(): Array<IHeaders> {
        const sessionId = this.getStoredSessionId();

        const headers = [
            {
                name: 'X-Client-SessionId',
                value: sessionId
            },
            {
                name: 'X-Client-ID',
                value: 'filbomobile'
            },
            {
                name: 'X-API-Key',
                value: '4ec8703b-232f-47a0-a9be-90ec2fdace98'
            },
            {
                name: 'X-Language',
                value: 'ro'
            }
        ];

        if (this.authService.isLoggedIn()) {
            const token = this.authService.accessToken;
            headers.push({
                name: 'Authorization',
                value: `Bearer ${token}`
            });
        }

        const customerId = appSettings.getString(Profile.CurrentCustomerId);
        if (!!customerId) {
            headers.push({
                name: 'X-CustomerId',
                value: customerId
            });
        }
        return headers;
    }

    public getStandardHttpHeadersReduced(): any {
        const headers = this.getStandardRequestHeaders();
        const reduced = headers.reduce((acc: { [key: string]: any }, header) => {
            acc[header.name] = header.value;
            return acc;
        }, {});
        return reduced;
    }

    private getStoredSessionId(): string {
        return this.sessionService.sessionId;
    }
}
