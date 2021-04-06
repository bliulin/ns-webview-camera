import { FilePickerService } from "./file-picker-service";
import { DocTypeMapper } from "~/app/upload-documents/services/doc-type-mapper";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { File } from "tns-core-modules/file-system";
import { FileHelper } from "~/app/upload-documents/services/file-helper";
import { openFilePicker } from 'nativescript-simple-filepicker';
import { PickerOptions } from "~/app/upload-documents/models/picker-options";

// File picker used for Android
export class SimpleFilePicker extends FilePickerService {
    public openFilePicker(pickerOptions: PickerOptions): Promise<File[]> {
        const extensions = this.getExtensions(pickerOptions.allowedExtensions);
        return new Promise((resolve, reject) => {
            openFilePicker({
                multipleSelection: true,
                extensions: extensions
            }).then((data) => {
                traceDebug('Files selected: ' + data.files);

                const files: File[] = [];
                data.files.forEach(path => {
                    const file = FileHelper.getFile(path);
                    files.push(file);
                });
                resolve(files);
            }).catch((err) => reject(err));
        });

    }

    private getExtensions(extensions: string[]) {
        return DocTypeMapper.getFileTypesForAndroid(extensions);
    }
}
