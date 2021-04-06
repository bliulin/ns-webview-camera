// import { MessagingService } from "../app/core/services/messaging.service";
// import { TestBed } from "@angular/core/testing";
// import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
//
// describe('Given messaging service', () => {
//
//     let service: MessagingService;
//
//     beforeEach(() => {
//         //TestBed.resetTestEnvironment();
//         //TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
//         service = new MessagingService();
//     });
//
//     it('should call the callback when state was changed before subscription', () => {
//         let callbackPayload = null;
//         service.setState('booking', { name: 'xxx' });
//         service.getState('booking').subscribe ((payload) => {
//             callbackPayload = payload;
//         });
//         expect(callbackPayload).toBeTruthy();
//         expect(callbackPayload.name).toBe('xxx');
//     });
//
//     it('should call the callback when event was raised after subscription', () => {
//         let callbackPayload = null;
//         service.getEvent('booked').subscribe((payload) => {
//             callbackPayload = payload;
//         });
//         service.raiseEvent('booked', { name: 'xxx' });
//
//         expect(callbackPayload).toBeTruthy();
//         expect(callbackPayload.name).toBe('xxx');
//     });
//
//     it('should call the callback only once with the latest payload if there were multiple state changes before subscription', () => {
//         let callbackPayload = null;
//         service.setState('booking', { name: 'xxx' });
//         service.setState('booking', { name: 'yyy' });
//         let counter = 0;
//         service.getState('booking').subscribe((payload) => {
//             ++counter;
//             callbackPayload = payload;
//         });
//         expect(callbackPayload).toBeTruthy();
//         expect(callbackPayload.name).toBe('yyy');
//         expect(counter).toBe(1);
//     });
// });
