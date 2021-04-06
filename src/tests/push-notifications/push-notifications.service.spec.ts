// import { PushNotificationsService } from '../../app/core/services/push-notifications/push-notifications.service';
// import { AuthenticationService } from "~/app/core/authentication/authentication.service";
// import { PushNotificationApiService } from "~/app/core/services/push-notifications/push-notification-api.service";
// import { AppSettingsService } from "~/app/core/services/app-settings.service";
// import { MessagingService } from "~/app/core/services/messaging.service";
// import { AuthServiceKyc } from "~/tests/push-notifications/auth-service";
// import { HttpClientFake } from "~/tests/core/services/http-client-fake";
// import { FirebaseFakeService } from "~/tests/push-notifications/firebase-fake.service";
// import { PnHandlerService } from "~/app/core/services/push-notifications/pn-handler.service";
// import { PushMessageModel } from "~/app/core/models/notifications/push-message-model";
//
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 3600000;
//
// describe('PushNotificationsService', () => {
//     let pushNotifService: PushNotificationsService;
//     let authService: AuthenticationService;
//     let api: PushNotificationApiService;
//     let appSettings: AppSettingsService;
//     let messaging: MessagingService;
//
//     beforeEach(() => {
//         authService = AuthServiceKyc.create();
//         appSettings = new AppSettingsService();
//         messaging = new MessagingService();
//
//         api = new PushNotificationApiService(new HttpClientFake());
//         const firebase = new FirebaseFakeService();
//         const handler = <PnHandlerService> {
//             handleMessage: (message: PushMessageModel) => Promise.resolve()
//         };
//         pushNotifService = new PushNotificationsService(api, appSettings, authService, messaging, firebase, handler, null);
//
//         appSettings.clear();
//         jasmine.clock().install();
//     });
//
//     afterEach(() => {
//         jasmine.clock().uninstall();
//     });
//
//     // it('should be created', () => {
//     //     const service: PushNotificationsService = TestBed.get(PushNotificationsService);
//     //     expect(service).toBeTruthy();
//     // });
//
//     it('registerPushHandlers should succeede', () => {
//         pushNotifService.registerPushHandlers();
//         expect(true).toBe(true);
//     });
//
//     it('should set notification as read after it processes it', (done) => {
//         pushNotifService.registerPushHandlers();
//
//         const as = <AuthServiceKyc> authService;
//         as.authenticated$.next(true);
//
//         pushNotifService.pushMessage(<PushMessageModel> {
//             filboNotificationId: "1"
//         });
//         spyOn(api, 'setNotificationAsRead').and.callThrough();
//
//         setTimeout(() => {
//             done();
//         }, 1000);
//
//         expect(api.setNotificationAsRead).toHaveBeenCalledTimes(1);
//     });
// });
