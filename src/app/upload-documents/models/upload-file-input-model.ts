import { Feature } from "~/app/core/models/feature";

export interface UploadFileInputModel {
    pageTitle: string;
    fileRepositoryId: string;
    source: Feature;
}
