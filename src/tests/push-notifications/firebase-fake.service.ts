import { FirebaseService } from "~/app/core/services/push-notifications/firebase.service";
import { Guid } from "guid-typescript";

export class FirebaseFakeService extends FirebaseService {
    protected get firebase(): any {
        return {
            addOnPushTokenReceivedCallback: (callback: (token: string) => void) => {
                callback(Guid.create().toString());
            },
            addOnMessageReceivedCallback: (callback: (message: any) => void) => {},
            init: () => {
                return Promise.resolve();
            }
        };
    }
}
