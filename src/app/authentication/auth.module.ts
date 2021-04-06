import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";
import { LogoutComponent } from './logout/logout.component';

@NgModule({
    imports: [AuthRoutingModule, SharedModule],
    declarations: [AuthComponent, LogoutComponent],
    providers: []
})
export class AuthModule {}