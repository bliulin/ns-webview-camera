import { UploadedFile } from "~/app/upload-documents/models/uploaded-file";

export interface UploadFileSet {
    uploadFileSetId: string;
    setName: string;
    details: string;
    allowedFileExtentions: string[];
    maxFileSize: number;
    maxFileNumber: number;
    readOnly: boolean;
    filesUploadedBy: string;
    uploadedFiles: UploadedFile[];
}
