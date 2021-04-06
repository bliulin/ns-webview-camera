"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var setDocumentPickerDelegate = function (value) { return global.documentPickerDelegate = value; };
var getDocumentPickerDelegate = function () { return global.documentPickerDelegate; };
var DocumentPickerDelegateImpl = (function (_super) {
    __extends(DocumentPickerDelegateImpl, _super);
    function DocumentPickerDelegateImpl() {
        return _super.call(this) || this;
    }
    DocumentPickerDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    DocumentPickerDelegateImpl.alloc = function () {
        return _super.alloc.call(this);
    };
    DocumentPickerDelegateImpl.prototype.initWithResolveReject = function (resolve, reject) {
        this.bindResolveReject(resolve, reject);
        return this;
    };
    DocumentPickerDelegateImpl.prototype.bindResolveReject = function (resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    };
    DocumentPickerDelegateImpl.prototype.documentPickerDidPickDocumentAtURL = function (controller, url) {
        var value = {
            files: [url.absoluteString]
        };
        this._resolve(value);
        setDocumentPickerDelegate(null);
    };
    DocumentPickerDelegateImpl.prototype.documentPickerDidPickDocumentsAtURLs = function (controller, urls) {
        var files = [];
        for (var i = 0; i < urls.count; i++) {
            files.push(urls[i].absoluteString);
        }
        var value = {
            files: files
        };
        this._resolve(value);
        setDocumentPickerDelegate(null);
    };
    DocumentPickerDelegateImpl.prototype.documentPickerWasCancelled = function (controller) {
        this._reject('Cancelled');
        setDocumentPickerDelegate(null);
    };
    DocumentPickerDelegateImpl.ObjCProtocols = [UIDocumentPickerDelegate];
    return DocumentPickerDelegateImpl;
}(NSObject));
exports.openFilePicker = function (params) {
    var documentTypes = params && params.extensions && utils.ios.collections.jsArrayToNSArray(params.extensions) || ['public.data'];
    var pickerMode = params && params.pickerMode || 0;
    var allowsMultipleSelection = params && !!params.multipleSelection || false;
    var app = UIApplication.sharedApplication;
    var window = app.keyWindow || (app.windows && app.windows.count > 0 && app.windows[0]);
    var controller = UIDocumentPickerViewController.alloc().initWithDocumentTypesInMode(documentTypes, pickerMode);
    controller.allowsMultipleSelection = allowsMultipleSelection;
    var visibleVC = utils.ios.getVisibleViewController(window.rootViewController);
    visibleVC.presentViewControllerAnimatedCompletion(controller, true, null);
    return new Promise(function (resolve, reject) {
        setDocumentPickerDelegate(DocumentPickerDelegateImpl.alloc().initWithResolveReject(resolve, reject));
        controller.delegate = getDocumentPickerDelegate();
    });
};
//# sourceMappingURL=simple-filepicker.ios.js.map