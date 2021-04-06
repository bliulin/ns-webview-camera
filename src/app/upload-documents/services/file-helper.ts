import { knownFolders, Folder, File } from "tns-core-modules/file-system";
import { formatNumber } from "@angular/common";

export class FileHelper {
    public static getFileContent(path: string): any {
        const file: File = File.fromPath(path);

        const binarySource = file.readSync((err) => {
            console.log(err);
        });

        return binarySource;
    }

    public static getFile(path: string): File {
        const file: File = File.fromPath(path);
        return file;
    }
}
