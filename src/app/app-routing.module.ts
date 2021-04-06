import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule, NSEmptyOutletComponent } from 'nativescript-angular/router';
import { AuthGuardService, OnboardingGuardService, PinGuardService } from './core/guards';
import { UnlockGuardService } from '~/app/core/guards/unlock-guard.service';
import { DashboardComponent } from '~/app/components/dashboard/dashboard.component';
import { CreditRequestModule } from '~/app/credit-request/credit-request.module';

import { AppRoutingPreloadStrategy } from '~/app/app-routing.preload-strategy';
import { ProfileModule } from './profile/profile.module';
import { EWalletModule } from './e-wallet/e-wallet.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';
import { OmroCheckboxUsageDemoComponent } from './shared/components/omro-checkbox/omro-checkbox-usage-demo/omro-checkbox-usage-demo.component';
import { DevLinksComponent } from './components/dev-links/dev-links.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard/(dashboard:home)', pathMatch: 'full' },
    { path: 'home', redirectTo: '/dashboard/(dashboard:home)', pathMatch: 'full' },
    {
        path: 'onboarding',
        loadChildren: () => import('~/app/onboarding/onboarding.module').then((m) => m.OnboardingModule)
    },
    {
        path: 'emailreg',
        loadChildren: () => import('~/app/email-registration/emailreg.module').then((m) => m.EmailRegModule)
    },
    {
        path: 'phonereg',
        loadChildren: () =>
            import('~/app/phone-registration/phone-registration.module').then((m) => m.PhoneRegistrationModule)
    },
    {
        path: 'appStatusError',
        loadChildren: () => import('~/app/startup/startup.module').then((m) => m.StartupModule)
    },
    {
        path: 'unlock',
        loadChildren: () => import('~/app/unlock/unlock.module').then((m) => m.UnlockModule)
    },
    {
        path: 'lock',
        canActivate: [UnlockGuardService],
        component: NSEmptyOutletComponent
    },
    {
        path: 'login',
        loadChildren: () => import('~/app/authentication/auth.module').then((m) => m.AuthModule)
    },
    {
        path: 'upload-documents',
        loadChildren: () =>
            import('~/app/upload-documents/upload-documents.module').then((m) => m.UploadDocumentsModule)
    },
    /*
    For development testing only    
    {
        path: 'dev-testing',
        component: DevLinksComponent
    },
    { path: 'usages', component: OmroCheckboxUsageDemoComponent }, */
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [OnboardingGuardService, AuthGuardService, UnlockGuardService, PinGuardService],
        children: [
            {
                path: 'accounts',
                loadChildren: () => AccountsModule,
                outlet: 'dashboard'
            },
            {
                path: 'transfers',
                outlet: 'dashboard',
                loadChildren: () => TransfersModule
            },
            {
                path: 'home',
                outlet: 'dashboard',
                loadChildren: () => CreditRequestModule
            },
            {
                path: 'e-wallet',
                outlet: 'dashboard',
                loadChildren: () => EWalletModule
            },
            {
                path: 'profile',
                loadChildren: () => ProfileModule,
                outlet: 'dashboard'
            }
        ]
    },
    {
        path: 'accounts',
        loadChildren: () => import('~/app/accounts/accounts.module').then((m) => m.AccountsModule)
    },
    {
        path: 'transfers',
        loadChildren: () => import('~/app/transfers/transfers.module').then((m) => m.TransfersModule)
    },
    {
        path: 'credit-request',
        loadChildren: () => import('~/app/credit-request/credit-request.module').then((m) => m.CreditRequestModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('~/app/profile/profile.module').then((m) => m.ProfileModule)
    },
    {
        path: 'e-wallet',
        loadChildren: () => import('~/app/e-wallet/e-wallet.module').then((m) => m.EWalletModule)
    },
    {
        path: 'kyc',
        loadChildren: () => import('~/app/kyc/kyc.module').then((m) => m.KycModule)
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes, { preloadingStrategy: AppRoutingPreloadStrategy })],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
