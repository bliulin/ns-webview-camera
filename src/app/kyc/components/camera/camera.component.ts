import { KycExecutionPermissions } from './web-client-with-permissions.android';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { isAndroid, WebView } from '@nativescript/core';
import { WebViewExt } from '@nota/nativescript-webview-ext';
import { WebViewInterface } from 'nativescript-webview-interface';

@Component({
    selector: 'camera',
    template: `
        <DockLayout>
            <Label dock="top">Camera POC</Label>
            <WebView #webView [src]="url" (loaded)="onWebViewLoaded()" marginTop="10"></WebView>

            <!-- <nota:WebViewExt #webView [src]="url" (loaded)="onWebViewLoaded()" debugMode="true"></nota:WebViewExt> -->
        </DockLayout>
    `
})
export class CameraComponent {
    public url = 'https://bliulinstorage.z6.web.core.windows.net/';
    //public url = "https://playcanv.as/p/jH8nuvmK/";

    @ViewChild('webView', { static: true })
    // tslint:disable-next-line: member-access
    public myWebView: ElementRef;

    private permissions = require('nativescript-permissions');
    private oLangWebViewInterface: WebViewInterface;

    constructor() {}

    public onWebViewLoaded(): void {
        console.log('Loaded webview');
        this.setupWebViewInterface(this.url);
        //this.setup2();
    }

    // private setup2() {
    //   const webView: WebView = this.myWebView.nativeElement;

    //   webView.on(WebViewExt.requestPermissionsEvent, (args: RequestPermissionsEventData) => {
    //     const wantedPerssions = args.permissions
    //         .map((p) => {
    //             if (p === "RECORD_AUDIO") {
    //                 return android.Manifest.permission.RECORD_AUDIO;
    //             }

    //             if (p === "CAMERA") {
    //                 return android.Manifest.permission.CAMERA;
    //             }

    //             return p;
    //         })
    //         .filter((p) => !!p);

    //     this.permissions
    //         .requestPermissions(wantedPerssions)
    //         .then(() => args.callback(true))
    //         .catch(() => args.callback(false));
    //  });
    // }

    private setupWebViewInterface(url: string): void {
        const webView: WebView = this.myWebView.nativeElement;

        if (!isAndroid) {
            return;
        }

        const settings = webView.android.getSettings();
        settings.setDomStorageEnabled(true);
        settings.setJavaScriptEnabled(true);
        settings.setSupportZoom(false);
        settings.allowFileAccess = true;
        settings.allowContentAccess = true;
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.android.setWebViewClient(new android.webkit.WebViewClient());

        this.permissions
            .requestPermissions([android.Manifest.permission.CAMERA], '')
            .then(() => {
                console.log('Permissions granted');
                webView.android.setWebChromeClient(new KycExecutionPermissions());

                webView.reload();
            })
            .catch((e) => {
                console.log(e);
                console.log('No permissions granted');
            });

        this.oLangWebViewInterface = new WebViewInterface(webView, url);
        this.listenToActions();
    }

    private listenToActions(): void {
        this.oLangWebViewInterface.on('action', (event) => {
            console.log('Received event: ' + JSON.stringify(event));
        });
    }
}
