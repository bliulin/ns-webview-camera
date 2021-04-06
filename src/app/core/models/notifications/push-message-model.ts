import { NotificationTypeEnum } from "~/app/core/models/notifications/notificationTypeEnum";
import { AlertType } from "~/app/core/models/notifications/alertType";
import { NotificationCallToActionTypeEnum } from "~/app/core/models/notifications/notificationCallToActionTypeEnum";
import { NotificationCallToActionLocationEnum } from "~/app/core/models/notifications/notificationCallToActionLocationEnum";

// Model received by push notification "data" structure, and by GET HTTP call within the serializedDictionary field
// of the FilboNotificationsOutputModel object.
export interface PushMessageModel {
    /**
     * Unique if of the notification
     */
    filboNotificationId?: string;
    /**
     * If not null, the notification targets this customer id
     */
    customerId?: string;
    /**
     * Date when the notification was created
     */
    generatedDateUtc?: Date;
    /**
     * Title of the modal to be shown
     */
    dataTitle?: string;
    /**
     * Body of the modal to be shown
     */
    dataBody?: string;
    /**
     * Priority between 1 and 10, 1 having the highest priority
     */
    priority?: number;
    /**
     * Type of UI to be used
     */
    notificationType?: NotificationTypeEnum;
    /**
     * Used to set the color for toast notifications
     */
    alertType?: AlertType;
    /**
     * If zero, the alert should not close automatically. If greater than zero, the alert is hidden after this many seconds
     */
    autoCloseInterval?: number;
    /**
     * What the app should do if the notification is taped or a button is pressed (modal)
     */
    callToActionType?: NotificationCallToActionTypeEnum;
    /**
     * Where the app should navigate if the CallToActionType is Navigate
     */
    callToActionLocation?: NotificationCallToActionLocationEnum;
    /**
     * Id of a specific target. Depends on the location. When used, the app should use case insensitive comparision
     */
    callToActionReference?: string;
    /**
     * Value indicating whether or not the data received in the push message is complete. If not, it should perform a GET
     * HTTP request using the filboNotificationId to retrieve all the information for this push notification.
     */
    complete: boolean;
}
