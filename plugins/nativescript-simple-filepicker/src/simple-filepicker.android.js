"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var permissions = require("nativescript-perms");
function callIntent(context, intent, pickerType) {
    return permissions.request('storage').then(function () {
        return new Promise(function (resolve, reject) {
            var onEvent = function (e) {
                console.log(' startActivityForResult ', e.requestCode);
                if (e.requestCode === pickerType) {
                    resolve(e);
                    app.android.off(app.AndroidApplication.activityResultEvent, onEvent);
                }
            };
            app.android.once(app.AndroidApplication.activityResultEvent, onEvent);
            context.startActivityForResult(intent, pickerType);
        });
    });
}
function setMimeTypeOnIntent(intent, extensions) {
    if (extensions.length > 1) {
        intent.setType("*/*");
        intent.putExtra(android.content.Intent.EXTRA_MIME_TYPES, extensions);
    }
    else {
        if (extensions.length === 1) {
            intent.setType(extensions[0]);
        }
    }
}
exports.openFilePicker = function (params) {
    var extensions;
    if (params && params.extensions && params.extensions.length > 0) {
        extensions = Array.create(java.lang.String, params.extensions.length);
        for (var i = 0; i < params.extensions.length; i++) {
            extensions[i] = params.extensions[i];
        }
    }
    var context = app.android.foregroundActivity || app.android.startActivity;
    var FILE_CODE = 1231;
    var intent = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
    intent.addCategory(android.content.Intent.CATEGORY_OPENABLE);
    intent.setAction(android.content.Intent.ACTION_OPEN_DOCUMENT);
    intent.putExtra(android.content.Intent.EXTRA_ALLOW_MULTIPLE, params && !!params.multipleSelection || false);
    setMimeTypeOnIntent(intent, extensions);
    return callIntent(context, intent, FILE_CODE).then(function (result) {
        if (result.resultCode === android.app.Activity.RESULT_OK) {
            if (result.intent != null) {
                var uri = result.intent.getData();
                var uris = [uri];
                if (!uri) {
                    uris = [];
                    var clipData = result.intent.getClipData();
                    if (clipData) {
                        for (var i = 0; i < clipData.getItemCount(); i++) {
                            var clipDataItem = clipData.getItemAt(i);
                            var fileUri = clipDataItem.getUri();
                            uris.push(fileUri);
                        }
                    }
                }
                var paths = uris.map(function (uri) { return com.nativescript.simple.FilePicker.getPath(context, uri); });
                return {
                    files: paths
                };
            }
            return {
                files: []
            };
        }
        else {
            throw new Error('no_file');
        }
    });
};
//# sourceMappingURL=simple-filepicker.android.js.map