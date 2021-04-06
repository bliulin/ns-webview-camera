import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { Routes } from "@angular/router";
import { UploadMainPageComponent } from "./pages/upload-main-page/upload-main-page.component";
import { UploadOnSetComponent } from "~/app/upload-documents/pages/upload-on-set/upload-on-set.component";

const routes: Routes = [
    { path: "", component: UploadMainPageComponent, pathMatch: "full" },
    { path: "upload/:uploadFileSetId", component: UploadOnSetComponent, pathMatch: "full" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class UploadDocumentsRoutingModule {
}
