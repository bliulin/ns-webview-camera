import { Component, Input } from '@angular/core';
import { FileUploadViewModel } from "~/app/upload-documents/models/file-upload-view-model";

@Component({
    selector: 'omro-document-viewer',
    templateUrl: './document-viewer.component.html',
    styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent {
    @Input()
    public file: FileUploadViewModel;
}
