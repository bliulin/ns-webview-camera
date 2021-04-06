// import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// import { nsTestBedRender, nsTestBedAfterEach, nsTestBedBeforeEach } from 'nativescript-angular/testing';
// import { TestBed, inject, fakeAsync, ComponentFixture } from '@angular/core/testing';
// import { AppStatusComponent } from '~/app/startup/app-status.component';
// import { AppStatusResponse } from '~/app/startup/app-status-response';
// import { AppStatusHttpService } from '~/app/startup/app-status-http.service';

// var reflect = require('reflect-metadata'); // to be able to examine annotation
// var component = require('../app/startup/app-status.component');

// describe('Given the AppStatusComponent spec', () => {
//     let httpMock: HttpTestingController;
//     let appStatusComponent: AppStatusComponent;

//     beforeEach(async () => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule, AppStatusComponent],
//             providers: [AppStatusHttpService]
//         });

//         beforeEach(nsTestBedBeforeEach([AppStatusComponent], [AppStatusHttpService]));

//         afterEach(nsTestBedAfterEach());

//         service = TestBed.get(RetryableHttpClientService);
//         httpMock = TestBed.get(HttpTestingController);

//         appStatusComponent = new component.AppStatusComponent(null, null, TestBed.get(AppStatusHttpService));

//         const fixture = TestBed.createComponent(AppStatusComponent);
//         appComponent = fixture.debugElement.componentInstance;
//     });

//     afterEach(() => {
//         httpMock.verify();
//     });

//     it('should call publicInfo API upon application cold start', () => {
//         const appStatusService = TestBed.get(AppStatusHttpService);
//         spyOn(appStatusService, 'getAppStatusResponse').and.returnValue(<AppStatusResponse>{
//             sessionId: '123'
//         });

//         nsTestBedRender(AppStatusComponent).then((fixture: ComponentFixture<AppStatusComponent>) => {
//             const comp = fixture.componentRef.instance;
//             expect(1).toBe(1);
//         });
//     });

//     it('should call publicInfo API upon application cold start', () => {
//         let appStatusService = TestBed.get(AppStatusHttpService);
//         spyOn(appStatusService, 'getAppStatusResponse').and.returnValue(<AppStatusResponse>{
//             sessionId: '123'
//         });

//         let comp = new AppStatusComponent(null, null, appStatusService, null, null);
//         comp.ngOnInit();

//         expect(1).toBe(1);
//     });
// });
