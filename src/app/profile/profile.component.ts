import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { Observable, combineLatest, throwError, Subject } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';
import { UserProfileStateService } from '../core/services/profile/user-profile-state.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { BaseComponent } from '../shared/base.component';
import { NotificationBannerService } from '~/app/shared/services';
import { ApplicationService } from '~/app/core/services/application.service';

@Component({
    selector: 'omro-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
    public vm$: Observable<any>;

    constructor(
        private page: Page,
        routerExtensions: RouterExtensions,
        private userProfileService: UserProfileStateService,
        private notificationService: NotificationBannerService,
        application: ApplicationService
    ) {
        super(routerExtensions, application);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.userProfileService.invalidateCache();

        this.vm$ = combineLatest([
            this.userProfileService.user$,
            this.userProfileService.companies$,
            this.userProfileService.currentCompany$
        ])
            .pipe(
                map(([user, companies, currentCompany]) => ({
                    user,
                    companies,
                    currentCompany
                }))
            )
            .pipe(catchError(err => this.handleError(err)))
            .pipe(retryWhen(this.getNoConnectivityRetryStrategy()));
    }

    private handleError(err: any) {
        this.notificationService.showGenericError(err);
        return throwError(err);
    }
}
