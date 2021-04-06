import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "~/app/shared/validators/validators.component";
import { CompanyApiService } from "../../services/company-api.service";
import { UserProfileStateService } from "~/app/core/services/profile/user-profile-state.service";
import { NotificationBannerService } from "~/app/shared/services";
import { BaseComponent } from "~/app/shared/base.component";

@Component({
    selector: "omro-company-add",
    templateUrl: "./company-add.component.html",
    styleUrls: ["./company-add.component.scss"]
})
export class CompanyAddComponent extends BaseComponent implements OnInit {
    public cui: FormControl;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private companyService: CompanyApiService,
        private userProfileService: UserProfileStateService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.initiateCuiControl();
    }

    public onCloseButtonTap(): void {
        this.goBack();
    }

    public onActionTap(): void {
        if (!this.cui.valid) {
            this.cui.markAsTouched();
            return;
        }
        this.companyService
            .requestNewCustomer(this.cui.value)
            .subscribe(
                () => this.handleSuccess(),
                error => this.handleError(error)
            );
    }

    private handleSuccess(): void {
        this.userProfileService.reload();
        this.routerExtensions.back();
    }

    private handleError(error: any): void {
        const errorDetails = error.error || null;
        switch (error.status) {
            case 400:
                // according user story details this should not happen and it must be a bug in FE
                if (!errorDetails || errorDetails.status !== 401) {
                    this.cui.setErrors({ invalid : true });
                    this.cui.markAsTouched();
                } else {
                    this.notificationBannerService.showError(errorDetails, 4000);
                }
                break;
        
            default:
                this.notificationBannerService.showGenericError(error);
                break;
        }
    }

    private initiateCuiControl(): void {
        this.cui = new FormControl('', [Validators.required, CustomValidators.validateCUI()]);
    }
}
