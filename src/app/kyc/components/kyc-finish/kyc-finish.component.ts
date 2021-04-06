import { Component, HostListener, OnInit } from '@angular/core';
import { KycService } from "~/app/kyc/services/kyc.service";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from 'nativescript-angular';
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { Subject, timer } from "rxjs";
import { UserProfileApiService } from "~/app/core/services/profile/user-profile-api.service";
import { delay, switchMap, takeUntil } from "rxjs/internal/operators";

@Component({
    selector: 'omro-kyc-finish',
    templateUrl: './kyc-finish.component.html',
    styleUrls: ['./kyc-finish.component.scss']
})
export class KycFinishComponent implements OnInit {

    public time: number = 0;
    public inProgress: boolean = true;
    public barIndicatorMax: number = 0;
    private unsubscribe$: Subject<any> = new Subject<any>();

    constructor(private kycService: KycService,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private backButtonHandler: BackButtonHandlerService,
                private userProfileApiService: UserProfileApiService) {
        this.page.actionBarHidden = true;
    }

    @HostListener("loaded")
    public pageInit(): void {
        this.backButtonHandler.supressBackButton();
    }

    ngOnInit() {
        timer(0, 5000)
            .pipe(delay(1000))
            .pipe(switchMap(() => this.userProfileApiService.get(true)))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((user) => {
                this.time++;
                if (user.isKYCDataAvailable === true) {
                    this.done();
                    this.redirectToSource();
                    return;
                }

                if (this.time >= 5) {
                    this.done();
                    return;
                }
            });

        timer(0, 150)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                if (this.barIndicatorMax < 120) {
                    this.barIndicatorMax += 1;
                }
            });
    }

    public ngOnDestroy(): void {
        if (!this.unsubscribe$) {
            return;
        }
        this.done();
    }

    public close(): void {
        this.backButtonHandler.disableBackHandler();
        this.kycService.reset();
        this.redirectToSource();
    }

    private done(): void {
        this.kycService.reset();
        this.inProgress = false;
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.unsubscribe$ = null;
    }

    private redirectToSource(): void {
        const redirectUrl = this.kycService.sourceUrl;
        this.routerExtensions.navigate(['/dashboard', {outlets: {dashboard: [redirectUrl]}}], {
            transition: {
                name: "fade"
            }
        });
    }
}
