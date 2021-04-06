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
import { CameraComponent } from './kyc/components/camera/camera.component';

const routes: Routes = [
    { path: '', redirectTo: '/camera', pathMatch: 'full' },
    { path: 'camera', component: CameraComponent }
  ]

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes, { preloadingStrategy: AppRoutingPreloadStrategy })],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
