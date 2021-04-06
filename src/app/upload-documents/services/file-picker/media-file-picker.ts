import { FilePickerService } from "./file-picker-service";
import { FilePickerOptions, Mediafilepicker } from "nativescript-mediafilepicker";
import { File, Folder, knownFolders } from "tns-core-modules/file-system";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { DocTypeMapper } from "~/app/upload-documents/services/doc-type-mapper";
import { FileCleanupService } from "~/app/upload-documents/services/file-picker/file-cleanup.service";
import { PickerOptions } from "~/app/upload-documents/models/picker-options";
const fileSystemModule = require("tns-core-modules/file-system");

// File picker used for iOS
export class MediaFilePicker extends FilePickerService {

    private static readonly omroTempFolderName: string = 'omro-temp';

    constructor(public cleanupService: FileCleanupService) {
        super();
        this.cleanupService.registerDirectory(this.getCleanupDirectory());
    }

    public openFilePicker(pickerOptions: PickerOptions): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const extensions = this.getExtensions(pickerOptions.allowedExtensions);
            const options: FilePickerOptions = {
                ios: {
                    extensions: extensions,
                    multipleSelection: true
                }
            };
            const filePicker = new Mediafilepicker();
            filePicker.openFilePicker(options);

            filePicker.on("getFiles", res => {
                const results = res.object.get('results');
                console.log('Received the following file(s):');
                console.dir(results);
                const paths: string[] = results.map(item => item.file);
                const files: File[] = [];
                paths.forEach(path => {
                    try {
                        // Copy the files from the temporary folder

                        const trimmedPath = path.indexOf('file://') === 0 ? path.substr(7) : path;
                        const srcFile: File = File.fromPath(trimmedPath);
                        const binarySource = srcFile.readSync((err) => {
                            traceError(`Failed to read file from path ${path}! Error: ` + err);
                            reject(err);
                        });

                        const filename = this.getFileName(path);
                        const documents: Folder = <Folder>knownFolders.documents();
                        const folder: Folder = <Folder>documents.getFolder(MediaFilePicker.omroTempFolderName);
                        const newPath: string = fileSystemModule.path.join(folder.path, filename);

                        const destFile: File = File.fromPath(newPath);
                        destFile.writeSync(binarySource, (err) => {
                            traceError(`Failed to write file to path ${newPath}! Error: ` + err);
                            reject(err);
                        });
                        files.push(destFile);
                    } catch (e) {
                        traceError(e);
                        reject(e);
                    }
                });
                resolve(files);
            });

            filePicker.on("error", res => {
                const msg = res.object.get('msg');
                traceError('There was an error getting the files: ' + msg);
                reject(msg);
            });

            filePicker.on("cancel", res => {
                const msg = res.object.get('msg');
                traceDebug('cancelled: ' + msg);
                reject(msg);
            });
        });
    }

    private getCleanupDirectory(): string {
        const documents: Folder = <Folder>knownFolders.documents();
        const folder: Folder = <Folder>documents.getFolder(MediaFilePicker.omroTempFolderName);
        return folder.path;
    }

    private getFileName(path: string): string {
        if (!path) {
            return '';
        }
        return path.substr(path.lastIndexOf('/') + 1);
    }

    private getExtensions(extensions: string[]): any[] {
        return DocTypeMapper.getFileTypesForIOS(extensions);
    }
}
