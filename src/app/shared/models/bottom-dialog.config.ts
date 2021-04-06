import { ViewContainerRef } from "@angular/core";

export enum BottomDialogButtonType {
    Primary = 'btn-primary',
    Error = 'btn-error',
    Transparent = 'btn-transparent',
    Secondary = 'btn-secondary'
}

export interface BottomDialogButton<T> {
    buttonType?: BottomDialogButtonType;
    text: string;
    isHidden?: boolean;
    result: T;
}

export enum Orientation {
    Horizontal,
    Vertical
}

export interface BottomDialogConfig<T> extends DialogConfigBase {
    actions: BottomDialogButton<T>[];
    orientation?: Orientation;
}

export interface YesNoDialogConfig extends DialogConfigBase {
    yesText?: string;
    noText?: string;
    yesButtonType?: BottomDialogButtonType;
    noButtonType?: BottomDialogButtonType;
}

interface DialogConfigBase {
    title: string;
    message?: string;
    viewContainerRef?: ViewContainerRef;
}

export const defaultBottomDialogButton: Partial<BottomDialogButton<any>> = {
    buttonType:BottomDialogButtonType.Secondary
}
