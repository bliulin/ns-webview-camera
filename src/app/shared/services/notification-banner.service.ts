import { Injectable } from '@angular/core';
import { Feedback, FeedbackPosition, FeedbackType } from 'nativescript-feedback';
import { Color } from 'tns-core-modules/color';
import { AppColors } from '~/app/shared/constants';
import { isAndroid } from 'tns-core-modules/platform';
import { localize } from 'nativescript-localize';
import { traceError } from '~/app/core/logging/logging-utils';
import { NoConnectivityError } from "~/app/core/models/no-connectivity-error";

@Injectable()
export class NotificationBannerService {
    private feedback: Feedback;

    constructor() {
        this.feedback = new Feedback();
    }

    public showSuccess(title: string, message: string, duration?: number): void {
        this.feedback.success({
            title: title,
            titleSize: 18,
            messageSize: 12,
            message: message,
            backgroundColor: new Color(AppColors.Green),
            titleColor: new Color(AppColors.White),
            messageColor: new Color(AppColors.White),
            titleFont: this.getFont(),
            messageFont: this.getFont(),
            duration: duration ? duration : 6000
        });
    }

    public showError(error: { title: string; detail: string }, duration?: number): void {
        this.feedback.show({
            title: error.title,
            titleSize: 18,
            messageSize: 12,
            message: error.detail,
            duration: duration ? duration : 6000,
            backgroundColor: new Color(AppColors.Red),
            titleColor: new Color(AppColors.White),
            messageColor: new Color(AppColors.White),
            titleFont: this.getFont(),
            messageFont: this.getFont(),
            icon: 'danger',
            android: {
                iconColor: new Color(AppColors.White)
            }
        });
    }

    public showGenericError(error?: any): void {
        if (error instanceof NoConnectivityError) {
            this.showError({
                title: (localize('Common.NoInternetError.title')),
                detail: (localize('Common.NoInternetError.detail'))
            });
            return;
        }

        this.showError({
            title: localize('Common.Error_Title'),
            detail: localize('Common.Generic_ErrorMessage')
        });
    }

    public showWarning(error: any, duration?: number): void {
        this.feedback.show({
            title: error.title,
            titleSize: 18,
            messageSize: 12,
            message: error.detail,
            duration: duration ? duration : 6000,
            backgroundColor: new Color(AppColors.Orange),
            titleColor: new Color(AppColors.White),
            messageColor: new Color(AppColors.White),
            titleFont: this.getFont(),
            messageFont: this.getFont(),
            icon: 'warning',
            android: {
                iconColor: new Color(AppColors.White)
            }
        });
    }

    public showErrorBottom(error: any, duration?: number): void {
        traceError(error);

        this.feedback.show({
            title: error.title,
            message: error.detail,
            duration: duration ? duration : 6000,
            position: FeedbackPosition.Bottom,
            type: FeedbackType.Error
        });
    }

    private getFont() {
        return isAndroid ? 'AzoSansRegular.otf' : 'Azo Sans';
    }
}
