export class KycExecutionPermissions extends android.webkit.WebChromeClient {
    onPermissionRequest(permissionRequest: android.webkit.PermissionRequest): void {
        console.log('onPermissionRequest: ' + permissionRequest);
        var resources = permissionRequest.getResources();

        console.log('Resources requested below...');
        for (let i = 0; i < resources.length; i++) {
            console.log(resources[i]);
        }

        try {
            //permissionRequest.grant([android.webkit.PermissionRequest.RESOURCE_VIDEO_CAPTURE]);
            permissionRequest.grant(resources);
            console.log('permission granted in web chrome client.')
        } catch (e) {
            console.log('ERROR: ' + e);
        }
    }

    //@ts-ignore
    onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage): boolean {
        console.log('CONSOLE message: ' + consoleMessage.message);
        return true;
    }
}

