import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResetPasswordOutputModel } from '~/app/core/models/user-profile/resetPasswordOutputModel';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '~/app/core/environment';

@Injectable()
export class SettingsApiService {
    constructor(private httpClient: HttpClient) {}

    public resetPassword(): Observable<ResetPasswordOutputModel> {
        return this.httpClient.post<ResetPasswordOutputModel>(`${APP_CONFIG.baseUrl}Public/resetpassword`, {});
    }
}
