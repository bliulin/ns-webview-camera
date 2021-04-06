import { UploadFileSet } from "~/app/upload-documents/models/upload-file-set";
import { UploadFileSetState } from "~/app/upload-documents/models/upload-file-set-state";
import { UploadedFileViewModel } from "~/app/upload-documents/models/uploaded-file-view-model";

export class UploadFileSetViewModel implements UploadFileSet {
    constructor(private ufs: UploadFileSet) {
        Object.assign(this, ufs);
        this.allowedFileExtentions = [];
        this.allowedFileExtentions.push(...ufs.allowedFileExtentions);
        if (ufs.uploadedFiles) {
            this.uploadedFiles = ufs.uploadedFiles.map(uf => new UploadedFileViewModel(uf));
        }
        else {
            this.uploadedFiles = [];
        }
    }

    public allowedFileExtentions: string[] = [];
    public details: string;
    public maxFileNumber: number;
    public maxFileSize: number;
    public readOnly: boolean;
    public setName: string;
    public uploadFileSetId: string;
    public uploadedFiles: UploadedFileViewModel[];
    public filesUploadedBy: string;

    public get uploadSetState(): UploadFileSetState {
        if (this.readOnly) {
            return UploadFileSetState.Readonly;
        }
        return this.uploadedFiles.length === 0 ? UploadFileSetState.New : UploadFileSetState.Editable;
    }
}
