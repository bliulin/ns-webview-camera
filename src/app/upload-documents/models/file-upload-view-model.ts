import { FileInfo } from "~/app/core/models/file-info";
import { formatNumber } from "@angular/common";
import * as app from "tns-core-modules/application";
import { UploadedFileViewModel } from "~/app/upload-documents/models/uploaded-file-view-model";
import { UploadFileType } from "~/app/upload-documents/models/upload-file-type";

export class FileUploadViewModel {
    private readonly imageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];
    private readonly wordExtensions: string[] = ['doc', 'docx'];
    private readonly excelExtensions: string[] = ['xls', 'xlsx'];

    public fileInfo: FileInfo | UploadedFileViewModel;
    public uploadFileSetId: string;
    public fileId: string;

    public isSelected: boolean = false;
    public isError: boolean = false;
    public error: string;

    public isUploading: boolean;
    public isDownloading: boolean;

    public static createUploadingFile(fileInfo: FileInfo, setId: string): FileUploadViewModel {
        const vm = new FileUploadViewModel();
        vm.isUploading = true;
        vm.fileInfo = fileInfo;
        vm.uploadFileSetId = setId;
        return vm;
    }

    public static createUploadedFile(uploadedModel: UploadedFileViewModel): FileUploadViewModel {
        const vm = new FileUploadViewModel();
        vm.isUploading = false;
        vm.fileInfo = uploadedModel;
        vm.uploadFileSetId = uploadedModel.fileSetId;
        vm.fileId = uploadedModel.fileId;
        return vm;
    }

    public get path(): string {
        return this.fileInfo.path;
    }

    public get fileName(): string {
        let filename = '';
        if (!this.path) {
            const fiUploadViewModel = <UploadedFileViewModel> this.fileInfo;
            if (fiUploadViewModel) {
                filename = fiUploadViewModel.fileName;
            }
        }
        else {
            filename = this.path.substr(this.path.lastIndexOf('/') + 1);
        }

        return filename;
    }

    public get sizeText(): string {
        return this.getSizeText(this.fileInfo.sizeInBytes);
    }

    public get fileType(): UploadFileType {
        if (this.isPdf) {
            return UploadFileType.PDF;
        }
        if (this.isImage) {
            return UploadFileType.Image;
        }
        return UploadFileType.Unknown;
    }

    public getImagePath(): string {
        if (this.isImage) {
            return '~/app/images/extension_jpg.svg';
        }
        if (this.isPdf) {
            return '~/app/images/extension_pdf.svg';
        }
        if (this.isWordDocument) {
            return '~/app/images/extension_doc.svg';
        }
        if (this.isExcelDocument) {
            return '~/app/images/extension_xls.svg';
        }
        return '~/app/images/extension_generic.svg';
    }

    public get isPdf(): boolean {
        const ext = this.getExtension();
        return ext.toLowerCase() === "pdf";
    }

    public get isImage(): boolean {
        const ext = this.getExtension();
        return this.imageExtensions.some(item => item.toLowerCase() === ext.toLowerCase());
    }

    public get isWordDocument(): boolean {
        const ext = this.getExtension();
        return this.wordExtensions.some(item => item.toLowerCase() === ext.toLowerCase());
    }

    public get isExcelDocument(): boolean {
        const ext = this.getExtension();
        return this.excelExtensions.some(item => item.toLowerCase() === ext.toLowerCase());
    }

    private getExtensionFromFileInfo(): string {
        let ext = '';
        const fiUploadViewModel = <UploadedFileViewModel> this.fileInfo;
        if (fiUploadViewModel) {
            ext = fiUploadViewModel.fileExtension.toLowerCase()
                .replace('.', '')
                .replace('*', '');
        }
        return ext;
    }

    private getExtensionFromPath(): string {
        if (!this.path) {
            return '';
        }
        return this.path.substr(this.path.lastIndexOf('.') + 1);
    }

    private getExtension(): string {
        let ext = this.getExtensionFromPath();
        if (!ext) {
            ext = this.getExtensionFromFileInfo();
        }
        return ext;
    }

    private getSizeText(sizeInBytes: number): string {
        if (sizeInBytes < 1024) {
            return `${this.getFormattedNumber(sizeInBytes)} B`;
        }
        let size: number = sizeInBytes / 1024;
        if (size < 1024) {
            return `${this.getFormattedNumber(size)} KB`;
        }

        size /= 1024;
        return `${this.getFormattedNumber(size)} MB`;
    }

    private getFormattedNumber(value: number): string {
        return formatNumber(value, 'en', '1.0-2');
    }
}
