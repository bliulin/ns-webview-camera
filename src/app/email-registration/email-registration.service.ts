import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '~/app/core/environment';
import { Account, EmailRegistrationResponse, ValidationCodeRequest } from './models';

const startRegistrationApiUrl = 'Public/startregistration';
const validateEmailApiUrl = 'Public/validateemail';
const resendEmailCodeApiUrl = 'Public/resendemailcode';

@Injectable()
export class EmailRegistrationService {
    constructor(private httpClient: HttpClient) {}

    public startRegistration(newAccount: Account): Observable<EmailRegistrationResponse> {
        return this.httpClient.post<EmailRegistrationResponse>(`${APP_CONFIG.baseUrl}${startRegistrationApiUrl}`, {
            email: newAccount.email,
            cif: newAccount.cif,
            termsAndConditionsAccepted: newAccount.termsAndConditionsAccepted,
            marketingConsentIsGiven: newAccount.marketingConsentIsGiven
        });
    }

    public validateEmail(validationCode: ValidationCodeRequest): Observable<ValidationCodeRequest> {
        return this.httpClient.post<ValidationCodeRequest>(
            `${APP_CONFIG.baseUrl}${validateEmailApiUrl}`,
            validationCode
        );
    }

    public resendEmailCode(registrationId: string): Observable<any> {
        return this.httpClient.post<string>(`${APP_CONFIG.baseUrl}${resendEmailCodeApiUrl}`, {
            registrationId: registrationId
        });
    }
}
 