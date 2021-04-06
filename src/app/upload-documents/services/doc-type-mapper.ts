declare const kUTTypePDF, kUTTypeText, kUTTypeImage, kUTTypeContent, kUTTypeItem;

export class DocTypeMapper {
    public static getFileTypesForAndroid(extensions: string[]): string[] {
        const res = extensions.map(ext => this.mapFileExtensionToMIMEType(ext)).filter(item => !!item);
        return res;
    }

    public static getFileTypesForIOS(extensions: string[]): any[] {
        const kutTypes = [];
        extensions.forEach(ext => {
            const kutTypesForExt = this.mapFileExtensionToUTType(ext).filter(item => !!item);
            kutTypes.push(...kutTypesForExt);
        });

        return kutTypes;
    }

    public static getMimeTypeFrom(path: string): string {
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const extension = filename.substring(filename.lastIndexOf('.') + 1);
        return this.mapFileExtensionToMIMEType(extension);
    }

    private static mapFileExtensionToUTType(ext: string): any[] {
        //extensions = [kUTTypePDF, kUTTypeText]; // you can get more types from here: https://developer.apple.com/documentation/mobilecoreservices/uttype

        ext = ext.replace('.', '').toLowerCase();
        switch (ext) {
            case "pdf":
                return [kUTTypePDF];
            case "txt":
                return [kUTTypeText];
            case "jpg":
            case "jpeg":
            case "png":
                return [kUTTypeImage];
            case "*":
                return [kUTTypeContent, kUTTypeItem];
            default:
                return [kUTTypeContent, kUTTypeItem];
        }
    }

    private static mapFileExtensionToMIMEType(ext: string): string {
        switch (ext.toLowerCase()) {
            case "pdf":
                return "application/pdf";
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return "image/*";
            case "txt":
                return "text/plain";
            default:
                return "*/*";
        }
    }
}
