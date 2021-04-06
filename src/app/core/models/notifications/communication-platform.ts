import { isAndroid } from "tns-core-modules/platform";

export class CommunicationPlatform {
    public static getCommunicationPlatformValue(): string {
        return isAndroid ? 'fcm' : 'apns';
    }
}
