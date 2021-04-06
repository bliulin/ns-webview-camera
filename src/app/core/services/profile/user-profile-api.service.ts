import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG } from '../../environment';
import { Observable } from 'rxjs';
import { UserProfileOutputModel } from '../../models/user-profile';
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { tap } from 'rxjs/operators';

const apiUrl = 'Private/userprofile';

@Injectable({ providedIn: 'root' })
export class UserProfileApiService {
    constructor(private httpClient: HttpClient,
        private analyticsService: AnalyticsService) {}

    public get(hideProgress?: boolean): Observable<UserProfileOutputModel> {
        let httpHeaders = new HttpHeaders();
        if (hideProgress === true) {
            httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        }
        return this.httpClient.get<UserProfileOutputModel>(`${APP_CONFIG.baseUrl}${apiUrl}`, { headers: httpHeaders }).pipe( tap( up => this.analyticsService.updateUserInfo({ 
            cui: up.customerMappings[0].customer.customerNUID,
            email: up.email,
            phoneNumber: up.phoneNumber,
            firstName: up.firstName,
            lastName: up.lastName,
            userId: up.userId})));
    }
}
