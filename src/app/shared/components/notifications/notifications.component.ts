import { Message, messaging } from "nativescript-plugin-firebase/messaging";
import { OnInit, Component } from "@angular/core";

@Component({
    template: '<Label text="Wait for your push messages..."></Label>'
})
// This is only a test component for demonstrating push notifications using Firebase Cloud Messaging.
export class NotificationsComponent implements OnInit {

    public ngOnInit(): void {
        this.doRegisterPushHandlers();
    }

    // You could add these handlers in 'init', but if you want you can do it seperately as well.
    // The benefit being your user will not be confronted with the "Allow notifications" consent popup when 'init' runs.
    public doRegisterPushHandlers(): void {
        messaging.addOnPushTokenReceivedCallback(
            token => {
                console.log("Firebase plugin received a push token: " + token);
            }
        );

        messaging.addOnMessageReceivedCallback(
            message => {
                console.log("Push message received: " + JSON.stringify(message));

                const msg = JSON.stringify(message);
                alert(msg);

                // if (message.foreground) {
                //     alert({
                //         title: message.title,
                //         message: message.body,
                //         okButtonText: "OK"
                //     });
                // } else {
                //     console.log('background message: ' + JSON.stringify(message));
                // }
            }
        ).then(() => {
            console.log("Added addOnMessageReceivedCallback");
        }, err => {
            console.log("Failed to add addOnMessageReceivedCallback: " + err);
        });
    }
}
