import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { APP_CONFIG } from "../environment";
import { traceDebug, traceError } from "../logging/logging-utils";
import { KeystoreService } from "../services/keystore.service";
import { AppEvents, AppStatus, Authentication } from "~/app/shared/constants";
import { LoginResponse } from "./login-response";
import { BehaviorSubject, Observable, of, ReplaySubject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import { getQueryParam } from "../url-utils";
import { PKCEService } from "../crypto/pkce.service";
import { MessagingService } from "../services/messaging.service";
import { UserProfileStateService } from "../services/profile/user-profile-state.service";
import * as appSettings from "tns-core-modules/application-settings";

@Injectable()
export class AuthenticationService {
    private _accessToken: string;
    private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private httpClient: HttpClient,
                private keyStore: KeystoreService,
                private pkceCodesService: PKCEService,
                private profileStateService: UserProfileStateService,
                private messagingService: MessagingService) {
        this.messagingService.getState<string>(AppEvents.RefreshToken).subscribe(rtoken => {
            traceDebug('🔑 [auth.service] Refresh token after registration has been received!');
            this.sendRefreshToken(rtoken)
                .pipe(delay(200)) //not sure why but seems to help.
                .pipe(switchMap(() => this.profileStateService.loadUserProfile()))
                .subscribe(() => {
                    //not sure why but seems to help.
                    //does nou work with an empty subscribe :-?
                    traceDebug("[auth.service] OK");
                });
        });
    }

    public isLoggedIn(): boolean {
        return !!this._accessToken || !!(this._accessToken = this.keyStore.getSync(AppStatus.AccessToken));
    }

    public get authenticated$(): Observable<boolean> {
        if (this.isLoggedIn()) {
            this._authenticated.next(true);
        }

        return this._authenticated;
    }

    public login(url: string): Observable<LoginResponse> {
        const code = getQueryParam(url, 'code');
        traceDebug("Code: " + code);

        if (!code) {
            traceError('⛔ [auth.service] Failed to receive authentication code from OAuth server!');
            return of({
                success: false
            });
        }

        const tokenUrl = this.composeTokenRequestUrl();
        const requestBody = this.composeRequestBodyForLogin(code);

        return this.postUrlEncodedMessage(tokenUrl, requestBody)
            .pipe(
                tap((r: any) => {
                    this.storeTokensInKeystore(r);
                    this._accessToken = r.access_token;
                }),
                switchMap(() => this.profileStateService.loadUserProfile()),
                tap(() => this._authenticated.next(true)),
                map(r => <LoginResponse>{
                    success: true,
                    nextUrl: ''
                })
            );
    }

    public refreshToken(): Observable<any> {
        return this.sendRefreshToken(this.getRefreshToken());
    }

    public get accessToken(): string {
        return this._accessToken;
    }

    public getLoginUrl(): string {
        const codeChallenge = this.pkceCodesService.generateCodeChallenge();
        return APP_CONFIG.authenticationBaseUrl + `connect/authorize?client_id=${APP_CONFIG.clientID}&response_type=code&scope=openid%20profile%20offline_access%20api.full_access&redirect_uri=${APP_CONFIG.omroProtocol}&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    }

    public getLogoutUrl(): string {
        const idToken: string = this.keyStore.getSync(AppStatus.IdToken);
        const urlLogoutRemoveCookies = `${APP_CONFIG.authenticationBaseUrl}account/logoutapp?logoutid=${idToken}`;
        return urlLogoutRemoveCookies;
    }

    public endSession(): Observable<any> {
        const idToken: string = this.keyStore.getSync(AppStatus.IdToken);
        const urlEndSession = `${APP_CONFIG.authenticationBaseUrl}connect/endsession?id_token_hint=${idToken}&post_logout_redirect_uri=${APP_CONFIG.omroProtocol}`;

        return this.httpClient.get(urlEndSession, {
            headers: new HttpHeaders({
                Accept: 'text/html'
            }),
            responseType: 'text'
        });
    }

    public async clearSessionData(): Promise<void> {
        this._accessToken = null;
        await this.removeTokensFromKeystore();
        this.clearAppSettings();
        this._authenticated.next(false);
    }

    private sendRefreshToken(rtoken: string): Observable<any> {
        const url = this.composeTokenRequestUrl();
        const requestBody = this.composeRequestBodyForRefresh(rtoken);

        return this.postUrlEncodedMessage(url, requestBody)
            .pipe(tap((response: any) => {
                    this.storeTokensInKeystore(response);
                    this._accessToken = response.access_token;
                    traceDebug('🔑 [auth.service ] Access token stored!');
                    traceDebug('🔑 [auth.service ] Refresh token stored!');
                    traceDebug('🔑 [auth.service ] Id token stored!');
                },
                error => {
                    traceError('⛔ [auth.service | refresh] Failed to receive access token from OAuth server!');
                }));
    }

    private async storeTokensInKeystore(response: any): Promise<boolean> {
        const values = await Promise.all([
            this.keyStore.set(AppStatus.AccessToken, response.access_token),
            this.keyStore.set(AppStatus.RefreshToken, response.refresh_token),
            this.keyStore.set(AppStatus.IdToken, response.id_token)
        ]);
        return values.every(value => value);
    }

    private async removeTokensFromKeystore(): Promise<boolean> {
        const result = await Promise.all([
            this.keyStore.remove(AppStatus.AccessToken),
            this.keyStore.remove(AppStatus.RefreshToken),
            this.keyStore.remove(AppStatus.IdToken),
            this.keyStore.remove(Authentication.Pin)
        ]);
        return result.every(v => v);
    }

    private getRefreshToken(): string {
        return this.keyStore.getSync(AppStatus.RefreshToken);
    }

    private composeRequestBodyForLogin(code: string): Map<string, string> {
        const codeVerifier = this.pkceCodesService.readCodeVerifier();
        const result = new Map([
            ['client_id', APP_CONFIG.clientID],
            ['grant_type', 'authorization_code'],
            ['code_verifier', codeVerifier],
            ['code', code],
            ['redirect_uri', APP_CONFIG.omroProtocol],
            ['scope', 'openid%20profile%20offline_access%20api.full_access']
        ]);
        return result;
    }

    private composeRequestBodyForRefresh(refreshToken: string): Map<string, string> {
        const result = new Map([
            ['client_id', APP_CONFIG.clientID],
            ['grant_type', 'refresh_token'],
            ['refresh_token', refreshToken],
            ['request_type', 'si:s']
        ]);
        return result;
    }

    private composeTokenRequestUrl(): string {
        return `${APP_CONFIG.authenticationBaseUrl}connect/token`;
    }

    private postUrlEncodedMessage(url: string, data: Map<string, string>): Observable<any> {
        let params = new HttpParams();
        Array.from(data.keys()).map(key => params = params.set(key, data.get(key)));
        return this.httpClient.post(url, params.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        });
    }

    private clearAppSettings(): void {
        appSettings.clear();
    }
}
