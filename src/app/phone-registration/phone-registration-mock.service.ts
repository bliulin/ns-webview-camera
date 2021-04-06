import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {
    FinishRegistrationRequest,
    FinishRegistrationResponse,
    PhoneRegistrationRequest,
    PhoneValidationRequest,
    RegistrationRequest
} from "~/app/phone-registration/models/request-types";
import {Observable, of, throwError} from "rxjs";

@Injectable()
export class PhoneRegistrationMockService {
    constructor(private httpClient: HttpClient) {
    }

    public registerPhone(param: PhoneRegistrationRequest): Observable<any> {
        return of({succes:true });
    }

    public validatePhone(param: PhoneValidationRequest): Observable<any> {
        if (param.phoneValidationCode === "9998") {
            return of({});
        } else if (param.phoneValidationCode === "9997"){
            return throwError(new HttpErrorResponse({status: 500}));
        } else if (param.phoneValidationCode === "9996"){
            return throwError(new HttpErrorResponse({status: 400,error:{title:'Too many atempts',status:403,detail:'Too many atempts entered'}}));
        } else {
            return throwError(
                new HttpErrorResponse({
                    status: 400,
                    error: {
                        title: "Invalid code",
                        status: 402,
                        detail: "Invalid code entered"
                    }
                })
            );
        }
    }

    public resendPhoneCode(param: RegistrationRequest): Observable<any> {
        return of({});
    }

    public finishRegistration(param: FinishRegistrationRequest): Observable<FinishRegistrationResponse> {
        return of({refreshToken: "asda", idToken: "asda"});
    }
}
