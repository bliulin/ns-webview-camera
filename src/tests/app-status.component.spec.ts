// // import { AppStatusHttpService } from '~/app/startup/app-status-http.service';
// import { AppStatusComponent } from '../app/startup/app-status.component';
// import { AppStatusResponse } from '~/app/startup/app-status-response';
// import { Observable, of } from 'rxjs';
// import * as appSettings from "tns-core-modules/application-settings";
// import { MessagingService } from '~/app/core/services/messaging.service';
// import { Type } from '@angular/core';
// import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/directives/dialogs';
// import { AuthenticationService } from '~/app/core/authentication/authentication.service';
// import { PKCEService } from '~/app/core/crypto/pkce.service';
// import { AppStatusHttpService } from '~/app/startup/app-status-http.service';
// import { TestBed } from "@angular/core/testing";
// import { KeystoreService } from "~/app/core/services/keystore.service";
// import { UserProfileStateService } from "~/app/core/services/profile/user-profile-state.service";
// import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedInit } from "nativescript-angular/testing";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { AppEvents, AppStatus } from "~/app/shared/constants";
// import { Guid } from "guid-typescript";
// import { AppState } from "~/app/shared/models";
// import { Router } from "@angular/router";
// import { RouterExtensions } from 'nativescript-angular';
//
// class AppStatusHttpServiceMock extends AppStatusHttpService {
//     public getAppStatusResponse(sessionId: string): Observable<AppStatusResponse> {
//         return of(getServerResponse(sessionId));
//     }
// }
//
// // tslint:disable-next-line: max-classes-per-file
// class ModalServiceMock extends ModalDialogService {
//     public showModal(type: Type<any>, options: ModalDialogOptions): Promise<any> {
//         return Promise.resolve(true);
//     }
// }
//
// describe('Given app status component', async () => {
//
//     let authService: AuthenticationService;
//     let modalService: ModalServiceMock;
//     let messagingService: MessagingService;
//     let service: AppStatusHttpServiceMock;
//
//     nsTestBedInit();
//     beforeEach(nsTestBedBeforeEach(
//         [AppStatusComponent],
//         [AuthenticationService,
//             MessagingService,
//             KeystoreService,
//             PKCEService,
//             UserProfileStateService,
//             AppStatusHttpService],
//         [HttpClientTestingModule]));
//     afterEach(nsTestBedAfterEach());
//
//     it('should call publicInfo API upon first application start with a valid GUID session ID', async () => {
//         authService.isLoggedIn = () => false;
//         messagingService.setState(AppEvents.AppState, AppState.LAUNCHED);
//
//         let comp = createComponent();
//
//         let callerSessionId: string;
//         service.getAppStatusResponse = jasmine.createSpy().and.callFake((sessionId: string) => {
//             callerSessionId = sessionId;
//             return of([]);
//         });
//         comp.appStatusHandled.subscribe(_ => {
//             //spyOn(service, 'getAppStatusResponse').and.callThrough();
//             expect(service.getAppStatusResponse).toHaveBeenCalledTimes(1);
//         });
//         await comp.ngOnInit();
//
//         expect(Guid.isGuid(callerSessionId)).toBe(true);
//         expect(Guid.parse(callerSessionId).isEmpty()).toBe(false);
//         authService = TestBed.get(AuthenticationService);
//         expect(authService).toBeTruthy();
//
//         //expect(true).toBe(true);
//     });
//
//     // it('should set values appSettings after the first call to publicInfo API', async () => {
//     //     authService.isLoggedIn = () => false;
//     //     messagingService.setState(AppEvents.AppState, AppState.LAUNCHED);
//     //
//     //     let comp = createComponent();
//     //
//     //     const response = getServerResponse('123');
//     //     spyOn(service, "getAppStatusResponse").and.callFake((sessionId: string) => {
//     //         response.sessionId = sessionId;
//     //         return of(response);
//     //     });
//     //
//     //     comp.appStatusHandled.subscribe(_ => {
//     //         expect(appSettings.getNumber(AppStatus.TaCVersion)).toBe(response.tacVersion);
//     //         expect(appSettings.getString(AppStatus.TaCContent)).toBe(response.tacContent);
//     //         expect(appSettings.getString(AppStatus.TaCLastUpdate)).toBe(response.tacLastUpdatedDate);
//     //         expect(appSettings.getString(AppStatus.MarketingAccord)).toBe(response.marketingAccord);
//     //     });
//     //
//     //     await comp.ngOnInit();
//     // })
//     //
//     // it('should set marketing and GDPR accord if public API call responds with success', async () => {
//     //     authService.isLoggedIn = () => false;
//     //     messagingService.setState(AppEvents.AppState, AppState.LAUNCHED);
//     //     const sessionId = Guid.create().toString();
//     //     const settings = getServerResponse(sessionId);
//     //     appSettings.setString(AppStatus.SessionID, sessionId);
//     //     updateSettings(settings); // settings are updated on the server
//     //     spyOn(service, 'getAppStatusResponse').and.callFake(sessionId => {
//     //         settings.sessionId = sessionId;
//     //         return of(settings);
//     //     });
//     //     let comp = createComponent();
//     //     comp.appStatusHandled.subscribe(_ => {
//     //         // Assert
//     //         expect(appSettings.getString(AppStatus.MarketingAccord)).toBe(settings.marketingAccord);
//     //     });
//     //     await comp.ngOnInit();
//     // })
//     //
//     // it('should set new version of terms and conditions when the application is launched, if the user is authenticated, the T&C have changed and the user has agreed to them', async () => {
//     //     // Arrange
//     //     authService.isLoggedIn = () => true;
//     //     messagingService.setState(AppEvents.AppState, AppState.LAUNCHED);
//     //     const sessionId = Guid.create().toString();
//     //     const settings = getServerResponse(sessionId);
//     //     storeSettings(settings); // initial settings values
//     //     updateSettings(settings); // settings are updated on the server
//     //     spyOn(service, 'getAppStatusResponse').and.callFake(sessionId => {
//     //         settings.sessionId = sessionId;
//     //         return of(settings);
//     //     });
//     //
//     //     // Act
//     //     let comp = createComponent();
//     //     comp.appStatusHandled.subscribe(_ => {
//     //         // Assert
//     //         expect(appSettings.getNumber(AppStatus.TaCVersion)).toBe(settings.tacVersion);
//     //     });
//     //
//     //     messagingService.getEvent(AppEvents.TermsAndConditionsOpened).subscribe (() => {
//     //         messagingService.raiseEvent(AppEvents.TermsAndConditionsClosed, true);
//     //     });
//     //
//     //     await comp.ngOnInit();
//     // })
//     //
//     // it('should not set new version of terms and conditions when the application is launched, if the user is authenticated, the T&C have changed but the user has not agreed to them', async () => {
//     //     // Arrange
//     //     authService.isLoggedIn = () => true;
//     //     messagingService.setState(AppEvents.AppState, AppState.LAUNCHED);
//     //     const sessionId = Guid.create().toString();
//     //     const settings = getServerResponse(sessionId);
//     //     storeSettings(settings); // initial settings values
//     //     const initialTacVersion = settings.tacVersion;
//     //     updateSettings(settings); // settings are updated on the server
//     //     spyOn(service, 'getAppStatusResponse').and.callFake(sessionId => {
//     //         settings.sessionId = sessionId;
//     //         return of(settings);
//     //     });
//     //
//     //     // Act
//     //     let comp = createComponent();
//     //     comp.appStatusHandled.subscribe(_ => {
//     //         // Assert
//     //         expect(appSettings.getNumber(AppStatus.TaCVersion)).toBe(initialTacVersion);
//     //     });
//     //
//     //     messagingService.getEvent(AppEvents.TermsAndConditionsOpened).subscribe(() => {
//     //         messagingService.raiseEvent(AppEvents.TermsAndConditionsClosed, false);
//     //     });
//     //
//     //     await comp.ngOnInit();
//     // })
//
//     function createComponent(): AppStatusComponent {
//         return TestBed.createComponent(AppStatusComponent).componentInstance;
//     }
// });
//
// function getServerResponse(sessionId: string): AppStatusResponse {
//     return {
//         sessionId: sessionId,
//         tacVersion: 1,
//         tacLastUpdatedDate: new Date().toISOString(),
//         tacContent: "terms and conditions",
//         marketingAccord: "marketing"
//     };
// }
//
// function storeSettings(response: AppStatusResponse): void {
//     appSettings.setString(AppStatus.SessionID, response.sessionId);
//     appSettings.setNumber(AppStatus.TaCVersion, response.tacVersion);
//     appSettings.setString(AppStatus.TaCContent, response.tacContent);
//     appSettings.setString(AppStatus.TaCLastUpdate, response.tacLastUpdatedDate);
// }
//
// function updateSettings(settings: AppStatusResponse): void {
//     settings.tacVersion = 2;
//     settings.tacContent = 'new value';
//     const updatedOn = new Date();
//     settings.tacLastUpdatedDate = updatedOn.toISOString();
//     settings.marketingAccord = "updated marketing accord";
// }
