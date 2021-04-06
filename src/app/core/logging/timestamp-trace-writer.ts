import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

import { messageType } from "tns-core-modules/trace/trace";

export class TimestampConsoleWriter {
    constructor() { }

    public write(message, category, type) {
        if (!console) {
            return;
        }

        const msgType = !type ? messageType.log : type;

        switch (msgType) {
            case messageType.log:                
                console.log(this.composeMessage('log', new Date(), message, category, type));
                break;
            case messageType.info:
                console.info(this.composeMessage('info', new Date(), message, category, type));
                break;
            case messageType.warn:                
                console.warn(this.composeMessage('warning', new Date(), message, category, type));
                break;
            case messageType.error:                
                console.error(this.composeMessage('error', new Date(), message, category, type));
                break;
            default:
                break;
        }
    }

    private composeMessage(messageType: string, date: Date, message: string, category: string, type: number): string {
        return `${message} | ${date.toISOString()} | ${messageType} | ${category} }`;

        // const result = {
        //     "messageType": "error",
        //     "date": new Date().toISOString(),
        //     "message": message,
        //     "category": category,
        //     "type": type
        // };
        // return JSON.stringify(result);
    }
}