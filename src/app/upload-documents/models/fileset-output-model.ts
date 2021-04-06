import { UploadedFile } from "~/app/upload-documents/models/uploaded-file";

export interface FilesetOutputModel {
    fileSetId: string;
    setName: string;
    details: string;
    allowedUploadFileExtentions: string[]; // Lista de extensii de fisiere permise pentru acest upload set valorile sunt in lowercase cu punct. Ex ['.jpg','.jpeg','.pdf']
    allowedUploadMaxFileSize: number; // The maxmimum allowed size for each file in the set (in bytes)
    allowedUploadMaxFileNumber: number; // The maximum number of documents allowed in the set
    readOnly: boolean; // If True, the set does not allow uploads or deletions of files in the set
    filesUploadedBy: string; // A friendly name that specifies who generated the set (OMRO, or the Display Name of the user)
    uploadedFiles: UploadedFile[]; // A list of files uploaded in this set
}
