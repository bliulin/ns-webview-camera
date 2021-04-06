import { Injectable } from '@angular/core';
import { traceError } from '~/app/core/logging/logging-utils';
const utilsModule = require('tns-core-modules/utils/utils');

@Injectable()
export class OpenFileService {
    public openFile(path: string): void {
        try {
            utilsModule.openFile(path);
        } catch (e) {
            traceError('Failed to open file: ' + e);
        }
    }
}
