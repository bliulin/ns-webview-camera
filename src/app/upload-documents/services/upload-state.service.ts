import { Injectable } from "@angular/core";
import { UploadFileSet } from "~/app/upload-documents/models/upload-file-set";
import { FileRepoViewModel } from "~/app/upload-documents/models/file-repo-view-model";
import { Feature } from "~/app/core/models/feature";

@Injectable({providedIn:"root"})
export class UploadStateService {
    public uploadedFiles: Map<string, UploadFileSet> = new Map();
    public fileRepositoryId: string;
    public source: Feature;

    public populateMetadata(repo: FileRepoViewModel): void {
        repo.uploadFileSets.forEach(ufs => this.uploadedFiles.set(ufs.uploadFileSetId, ufs));
        this.fileRepositoryId = repo.fileRepositoryId;
    }

    public clear(): void {
        this.fileRepositoryId = null;
        this.uploadedFiles.clear();
    }
}
