import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
    FinishRegistrationRequest,
    FinishRegistrationResponse,
    PhoneRegistrationRequest,
    PhoneValidationRequest,
    RegistrationRequest
} from "~/app/phone-registration/models/request-types";
import {APP_CONFIG} from "~/app/core/environment";

@Injectable()
export class PhoneRegistrationApiService {
    constructor(private httpClient: HttpClient) {}

    public registerPhone(param: PhoneRegistrationRequest): Observable<any> {
        return this.httpClient.post(
            `${APP_CONFIG.baseUrl}/public/registerphone`,
            param
        );
    }

    public validatePhone(param: PhoneValidationRequest): Observable<any> {
        return this.httpClient.post(
            `${APP_CONFIG.baseUrl}/public/validatephone`,
            param
        );
    }

    public resendPhoneCode(param: RegistrationRequest): Observable<any> {
        return this.httpClient.post(
            `${APP_CONFIG.baseUrl}/public/resendphonecode`,
            param
        );
    }

    public finishRegistration(param: FinishRegistrationRequest): Observable<FinishRegistrationResponse> {
        return this.httpClient.post<FinishRegistrationResponse>(
            `${APP_CONFIG.baseUrl}/public/finishregistration`,
            param
        );
    }
}

