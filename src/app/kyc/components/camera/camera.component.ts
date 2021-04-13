import { KycExecutionPermissions } from './web-client-with-permissions.android';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { isAndroid, WebView } from '@nativescript/core';
import { WebViewExt } from '@nota/nativescript-webview-ext';
import { WebViewInterface } from 'nativescript-webview-interface';
const permissions = require("nativescript-permissions");

@Component({
    selector: 'camera',
    template: `
        <DockLayout stretchLastChild="true">
            <Label dock="top" style="color: black">Camera POC</Label>
            <WebView #webView [src]="url" (loaded)="onWebViewLoaded()" marginTop="10"></WebView>
            <!-- <nota:WebViewExt #webView [src]="url" (loaded)="onWebViewLoaded()"></nota:WebViewExt> -->
        </DockLayout>
    `
})
export class CameraComponent {
    public url = 'https://bliulinstorage.z6.web.core.windows.net/';
    //public url = "https://playcanv.as/p/jH8nuvmK/";
    //public url = "https://webcamtests.com/";
    //public url = "https://www.onlinemictest.com/webcam-test/";
    //public url = "https://test-kyc-iframe.filbo.ro/selfie-one-stage?IdInternalRequest=5bb8180e-8983-4fd9-988a-ebbe832c7688&IdExternalRequest=bed988de-6573-41a8-baf5-7ca003a59c50&culture=RO";

    @ViewChild('webView', { static: true })
    // tslint:disable-next-line: member-access
    public myWebView: ElementRef;

    private permissions = require('nativescript-permissions');
    private oLangWebViewInterface: WebViewInterface;

    constructor() {}

    public onWebViewLoaded(): void {
        console.log('Loaded webview');
        this.setupWebViewInterface(this.url);
    }

    private setupWebViewInterface(url: string): void {
        const webView: WebView = this.myWebView.nativeElement;
        if (isAndroid) {
            const settings = webView.android.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setJavaScriptEnabled(true);
            settings.setSupportZoom(false);
            settings.allowFileAccess = true;
            settings.allowContentAccess = true;
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            settings.mediaPlaybackRequiresUserGesture = false;

            webView.android.setWebViewClient(new android.webkit.WebViewClient());

            permissions.requestPermissions([android.Manifest.permission.CAMERA], "").then(() => {
                console.log('Permissions granted');
                webView.android.setWebChromeClient(new KycExecutionPermissions());
                setTimeout(()=>{
                    webView.reload();
                    console.log('reloaded');
                }, 500);
            })
            .catch(() => {
                console.log('No permissions granted');
            });
        }
        this.oLangWebViewInterface = new WebViewInterface(webView, url);
        this.listenToActions();
    }

    private listenToActions(): void {
        this.oLangWebViewInterface.on('action', (event) => {
            console.log('Received event: ' + JSON.stringify(event));
        });
    }
}
