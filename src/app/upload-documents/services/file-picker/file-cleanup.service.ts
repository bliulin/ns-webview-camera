import { Injectable } from "@angular/core";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { Folder, knownFolders } from "tns-core-modules/file-system";

@Injectable({providedIn:"root"})
export class FileCleanupService {
    private paths: string[] = [];

    public registerDirectory(folderPath: string): void {
        if (this.paths.indexOf(folderPath) < 0) {
            this.paths.push(folderPath);
        }
    }

    public async cleanup(): Promise<any> {
        traceDebug("Cleaning up folders...");

        for (const folderPath of this.paths) {
            traceDebug('  --> ' + folderPath);
            const folder: Folder = <Folder>Folder.fromPath(folderPath);
            await folder.remove();
        }

        traceDebug("Finished cleaning up folders.");
    }
}
