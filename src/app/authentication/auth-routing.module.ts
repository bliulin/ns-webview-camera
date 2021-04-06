import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthComponent } from "./auth.component";
import { LogoutComponent } from "~/app/authentication/logout/logout.component";

const routes: Routes = [
    { path: "", component: AuthComponent },
    { path: "logout", component: LogoutComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AuthRoutingModule { }
