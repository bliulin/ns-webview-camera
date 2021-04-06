import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared/shared.module';
import { SetPinComponent } from './settings/set-pin/set-pin.component';
import { ConfirmPinComponent } from './settings/set-pin/confirm/confirm.component';
import { ActivateBiometricComponent } from './settings/activate-biometric/activate-biometric.component';
import { ChangePinComponent } from './settings/change-pin/change-pin.component';
import { ConfirmNewPinComponent } from './settings/change-pin/confirm/confirm.component';
import { CompanySelectionComponent } from './components/company-selection-modal/company-selection.component';
import { CompanyAddComponent } from './company/company-add/company-add.component';
import { CompanyApiService } from './services/company-api.service';
import { CompanyDetailsComponent } from './company/company-details/company-details.component';
import { QuestionnaireModule } from '~/app/credit-request/questionnaire/questionnaire.module';
import { CompanyDynamicFormComponent } from '~/app/profile/components/company-dynamic-form/company-dynamic-form.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { CompaniesCardComponent } from './components/companies-card/companies-card.component';
import { SettingsCardComponent } from './components/settings-card/settings-card.component';
import { CompanyAddButtonComponent } from './components/company-add-button/company-add-button.component';
import { PasswordResetConfirmationComponent } from './components/password-reset-confirmation/password-reset-confirmation.component';
import { CompanyStateService } from '~/app/profile/company/services/company-state.service';
import { SettingsApiService } from './services/settings-api.service';
import { ValidateAccountComponent } from './components/validate-account/validate-account.component';

@NgModule({
    imports: [ProfileRoutingModule, SharedModule, QuestionnaireModule],
    declarations: [
        ProfileComponent,
        CompanyAddComponent,
        CompanyDetailsComponent,
        ChangePinComponent,
        ConfirmNewPinComponent,
        SetPinComponent,
        ConfirmPinComponent,
        ActivateBiometricComponent,
        CompanySelectionComponent,
        CompanyDynamicFormComponent,
        ProfileCardComponent,
        CompaniesCardComponent,
        SettingsCardComponent,
        CompanyAddButtonComponent,
        PasswordResetConfirmationComponent,
        ValidateAccountComponent
    ],
    entryComponents: [CompanySelectionComponent],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [CompanyApiService, CompanyStateService, SettingsApiService]
})
export class ProfileModule {}
