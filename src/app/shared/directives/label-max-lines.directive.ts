// Usage: <Label maxLines="3" .. />

import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { Label } from 'tns-core-modules/ui/label';

declare const android: any;
declare const NSLineBreakMode: any;

@Directive({
    selector: 'Label[maxLines]'
})
export class LabelMaxLinesDirective implements OnInit, OnChanges {
    @Input('maxLines') public maxLines: number = 1;

    public get nativeView(): Label {
        return this.el.nativeElement;
    }

    constructor(private el: ElementRef) {}

    public ngOnInit(): void {
        const nativeView = this.nativeView;

        if (nativeView instanceof Label) {
            nativeView.on(Label.loadedEvent, () => {
                this.applyMaxLines();
            });
        }
    }

    public ngOnChanges(changes: any): void {
        if (changes.maxLines) {
            this.applyMaxLines();
        }
    }

    private applyMaxLines(): void {
        const nativeView = this.nativeView;

        const maxLines = Math.max(Number(this.maxLines) || 0, 1);

        if (nativeView.android) {
            nativeView.android.setMaxLines(maxLines);
            nativeView.android.setEllipsize(android.text.TextUtils.TruncateAt.END);
        } else if (nativeView.ios) {
            setTimeout(() => {
                nativeView.ios.numberOfLines = maxLines;
                nativeView.ios.adjustsFontSizeToFitWidth = false;
                nativeView.ios.lineBreakMode = NSLineBreakMode.ByTruncatingTail;
            }, 0);
        }
    }
}
