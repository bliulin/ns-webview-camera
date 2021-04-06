import { UploadedFile } from "~/app/upload-documents/models/uploaded-file";
import { FileInfo } from "~/app/core/models/file-info";
import { FileUploadViewModel } from "~/app/upload-documents/models/file-upload-view-model";

export class UploadedFileViewModel implements UploadedFile, FileInfo {
    public fileExtension: string;
    public fileId: string;
    public fileName: string;
    public fileSetId: string;
    public fileSizeInBytes: number;
    public generatedByUserId: string;
    public generatedByUserName: string;
    public generatedDate: Date;
    public mimeType: string;

    public path: string;
    public sizeInBytes: number;

    constructor(uploadedFile?: UploadedFile) {
        Object.assign(this, uploadedFile);
        this.sizeInBytes = this.fileSizeInBytes;
    }

    public static createFrom(fileUploadViewModel: FileUploadViewModel): UploadedFileViewModel {
        const instance = new UploadedFileViewModel();
        Object.assign(instance, fileUploadViewModel.fileInfo);
        instance.fileId = fileUploadViewModel.fileId;
        instance.fileSizeInBytes = instance.sizeInBytes;
        instance.fileSetId = fileUploadViewModel.uploadFileSetId;
        instance.fileName = fileUploadViewModel.fileName;
        return instance;
    }
}
