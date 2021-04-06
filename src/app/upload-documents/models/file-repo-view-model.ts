import { FilesetOutputModel } from "~/app/upload-documents/models/fileset-output-model";
import { UploadFileSet } from "~/app/upload-documents/models/upload-file-set";
import { FileRepositoryOutputModel } from "~/app/credit-request/models/fileRepositoryOutputModel";

export class FileRepoViewModel implements FileRepositoryOutputModel {
    public details: string;
    public fileRepositoryId: string;
    public fileSets: FilesetOutputModel[];
    public title: string;
    public uploadFileSets: UploadFileSet[];
}
