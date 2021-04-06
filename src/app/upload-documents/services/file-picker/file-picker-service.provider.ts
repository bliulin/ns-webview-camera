import * as app from "tns-core-modules/application";
import { MediaFilePicker } from "~/app/upload-documents/services/file-picker/media-file-picker";
import { SimpleFilePicker } from "~/app/upload-documents/services/file-picker/simple-file-picker";
import { FilePickerService } from "~/app/upload-documents/services/file-picker/file-picker-service";
import { FileCleanupService } from "~/app/upload-documents/services/file-picker/file-cleanup.service";

const filePickerServiceFactory = (fileCleanupService: FileCleanupService) => {
    return app.ios ? new MediaFilePicker(fileCleanupService) : new SimpleFilePicker();
};

export const filePickerServiceProvider = {
    provide: FilePickerService,
    useFactory: filePickerServiceFactory,
    deps: [FileCleanupService]
};
