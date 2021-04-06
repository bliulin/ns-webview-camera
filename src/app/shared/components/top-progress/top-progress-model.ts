export class TopProgressModel {
    constructor(args?: { progressValue?, maxValue?, showProgressValue?, minimized? }) {
        if (args) {
            Object.assign(this, args);
        }
    }

    public progressValue: number = 0; // current value of the progress
    public maxValue: number = 0; // max value of the progress
    public showProgressValue: boolean = true;
    public showBackButton: boolean;
    public minimized: boolean = false; // does not show the step number and cancel button

    public get stepProgressText(): string {
        return `${this.progressValue}/${this.maxValue}`;
    }
}
