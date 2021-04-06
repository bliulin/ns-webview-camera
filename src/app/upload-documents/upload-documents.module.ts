import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { UploadStateService } from "./services/upload-state.service";
import { SharedModule } from "~/app/shared/shared.module";
import { UploadDocumentsRoutingModule } from "./upload-documents.routing.module";
import { UploadMainPageComponent } from "./pages/upload-main-page/upload-main-page.component";
import { UploadOnSetComponent } from "./pages/upload-on-set/upload-on-set.component";
import { DocumentViewerComponent } from "./components/document-viewer/document-viewer.component";
import { CreditRequestModule } from "~/app/credit-request/credit-request.module";
import { FileCleanupService } from "~/app/upload-documents/services/file-picker/file-cleanup.service";
import { FileUploadComponent } from "~/app/upload-documents/components/file-upload/file-upload.component";
import { FileActionBarComponent } from "~/app/upload-documents/components/files-action-bar/file-action-bar.component";
import { FilesApiService } from "~/app/upload-documents/services/files-api.service";
import { CheckmarkComponent } from "~/app/upload-documents/components/checkmark/checkmark.component";
import { UploadFinishComponent } from "~/app/upload-documents/components/upload-finish/upload-finish.component";

@NgModule({
    declarations: [
        UploadMainPageComponent,
        UploadOnSetComponent,
        DocumentViewerComponent,
        FileUploadComponent,
        FileActionBarComponent,
        CheckmarkComponent,
        UploadFinishComponent
    ],
    imports: [SharedModule, UploadDocumentsRoutingModule],
    providers: [],
    entryComponents: [UploadFinishComponent],
    exports: [
        UploadMainPageComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class UploadDocumentsModule {}
