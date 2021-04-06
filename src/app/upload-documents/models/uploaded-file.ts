export interface UploadedFile {
    fileId: string;
    fileSetId: string;
    fileName: string;
    mimeType: string;
    fileExtension: string;
    fileSizeInBytes: number;
    generatedDate: Date;
    generatedByUserId: string;
    generatedByUserName: string;
}
