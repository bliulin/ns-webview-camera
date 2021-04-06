import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import {
    MaterialTextFieldComponent,
    MaterialNumberFieldComponent,
    ValidationCodeInputComponent,
    ValidationErrorComponent,
    TermsAndConditionsModalComponent,
    BackButtonComponent,
    CarouselScreenComponent,
    SuccessMessageComponent,
    CarouselSelectComponent,
    DropdownFieldComponent,
    DateFieldComponent,
    SingleSelectComponent,
    CalendarModalIosComponent,
    PhoneKeyboardComponent,
    PinViewComponent,
    PriceWheelComponent,
    OmroTextFieldComponent,
    InfoFieldComponent,
    TopProgressComponent,
    CardPanelComponent,
    CalendarModalAndroidComponent,
    BottomDialogComponent,
    OmroCheckboxComponent,
    CreditRequestProgressComponent,
    OmroRadioButtonComponent,
    OmroRadioButtonsSelectComponent,
    GenericPinComponent,
    BigMoneyComponent,
    OmroKycStatusComponent
} from './components';
import { NotificationBannerService } from './services';
import { CommonModule, DatePipe } from '@angular/common';
import { NgShadowModule } from 'nativescript-ng-shadow';
import { RoundOneThousandPipe, KebabcasePipe, FractionPipe, IbanPipe } from './pipes';
import { LabelMaxLinesDirective } from './directives';
import { NativeScriptMaterialCardViewModule } from 'nativescript-material-cardview/angular';
import { NativeScriptSvgModule } from '@teammaestro/nativescript-svg/angular';
import { WebViewExtModule } from '@nota/nativescript-webview-ext/angular';
import { OmroCheckboxUsageDemoComponent } from './components/omro-checkbox/omro-checkbox-usage-demo/omro-checkbox-usage-demo.component';
import { InformativePageComponent } from '~/app/shared/components/informative-page/informative-page.component';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { PinStateService } from './services/pin-state.service';
import { OmroActionButtonComponent } from './components/omro-action-button/omro-action-button.component';
import { SimpleModalComponent } from './components/simple-modal/simple-modal.component';

// This is a module that should be imported in every feature module. It should export vital modules like
// NativeScriptCommonModule, and it should contain directives and components used by every feature module.
// It should NOT be used for things that are only shared by a limited number of feature modules.
@NgModule({
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptLocalizeModule,
        TNSFontIconModule,
        NgShadowModule,
        NativeScriptSvgModule,
        NativeScriptMaterialCardViewModule,
        NativeScriptUIGaugeModule,
        WebViewExtModule
    ],
    exports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptLocalizeModule,
        CarouselScreenComponent,
        MaterialTextFieldComponent,
        OmroTextFieldComponent,
        MaterialNumberFieldComponent,
        ValidationCodeInputComponent,
        ValidationErrorComponent,
        SuccessMessageComponent,
        BackButtonComponent,
        TNSFontIconModule,
        DropdownFieldComponent,
        DateFieldComponent,
        PhoneKeyboardComponent,
        PinViewComponent,
        KebabcasePipe,
        CardPanelComponent,
        NgShadowModule,
        RoundOneThousandPipe,
        PriceWheelComponent,
        LabelMaxLinesDirective,
        NativeScriptSvgModule,
        NativeScriptMaterialCardViewModule,
        InfoFieldComponent,
        CarouselSelectComponent,
        OmroCheckboxComponent,
        OmroRadioButtonComponent,
        OmroRadioButtonsSelectComponent,
        TopProgressComponent,
        CreditRequestProgressComponent,
        TopProgressComponent,
        InformativePageComponent,
        NativeScriptUIGaugeModule,
        CloseButtonComponent,
        GenericPinComponent,
        OmroActionButtonComponent,
        BigMoneyComponent,
        FractionPipe,
        IbanPipe,
        OmroKycStatusComponent,
        WebViewExtModule
    ],
    declarations: [
        CarouselScreenComponent,
        TermsAndConditionsModalComponent,
        MaterialTextFieldComponent,
        OmroTextFieldComponent,
        MaterialNumberFieldComponent,
        ValidationCodeInputComponent,
        ValidationErrorComponent,
        SuccessMessageComponent,
        BackButtonComponent,
        DropdownFieldComponent,
        SingleSelectComponent,
        DateFieldComponent,
        CalendarModalIosComponent,
        CalendarModalAndroidComponent,
        PhoneKeyboardComponent,
        PinViewComponent,
        KebabcasePipe,
        CardPanelComponent,
        RoundOneThousandPipe,
        PriceWheelComponent,
        LabelMaxLinesDirective,
        InfoFieldComponent,
        CarouselSelectComponent,
        BottomDialogComponent,
        OmroCheckboxComponent,
        OmroRadioButtonComponent,
        OmroCheckboxUsageDemoComponent,
        OmroRadioButtonsSelectComponent,
        TopProgressComponent,
        CreditRequestProgressComponent,
        CreditRequestProgressComponent,
        TopProgressComponent,
        InformativePageComponent,
        CloseButtonComponent,
        GenericPinComponent,
        OmroActionButtonComponent,
        BigMoneyComponent,
        FractionPipe,
        IbanPipe,
        SimpleModalComponent,
        OmroKycStatusComponent
    ],
    providers: [DatePipe, NotificationBannerService, PinStateService, RoundOneThousandPipe, IbanPipe],
    entryComponents: [
        TermsAndConditionsModalComponent,
        SingleSelectComponent,
        CalendarModalIosComponent,
        CalendarModalAndroidComponent,
        BottomDialogComponent,
        SimpleModalComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
