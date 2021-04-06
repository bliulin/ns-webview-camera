import { File } from "tns-core-modules/file-system";
import { Injectable } from "@angular/core";
import { PickerOptions } from "~/app/upload-documents/models/picker-options";

@Injectable()
export abstract class FilePickerService {
    public abstract openFilePicker(options: PickerOptions): Promise<File[]>;
}
