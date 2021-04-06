import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { AppRoutingPreloadStrategy } from '~/app/app-routing.preload-strategy';
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
