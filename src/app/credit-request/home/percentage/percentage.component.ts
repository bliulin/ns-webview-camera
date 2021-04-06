import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { RadialBarIndicator } from 'nativescript-ui-gauge';

import { Observable, timer } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { Color } from 'tns-core-modules/color/color';

const defaultFontSize = 68;
const animationDuration = 2000; // milisecons

@Component({
    selector: 'omro-percentage',
    templateUrl: './percentage.component.html',
    styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent implements OnInit, AfterViewInit {
    @ViewChild('indicator', { static: false }) private indicator: ElementRef;

    @Input('value') public approvalSuccessRate: number;
    @Input() public titleFontSize: number = defaultFontSize;
    @Input() public animationEnabled: boolean = true;
    @Input() public indicatorFillColor: Color;

    public counter$: Observable<number> = new Observable<number>();
    public duration: number;
    private count: number;

    public ngOnInit(): void {
        this.duration =
            this.approvalSuccessRate > 0 ? animationDuration / this.approvalSuccessRate : animationDuration / 100;
        this.count = this.approvalSuccessRate > 0 ? 0 : 100;
    }

    public ngAfterViewInit(): void {
        const barIndicator = this.indicator.nativeElement as RadialBarIndicator;
        if (this.animationEnabled) {
            this.counter$ = timer(0, this.duration).pipe(
                takeWhile(() => this.approvalSuccessRate !== this.count),
                tap(() => (barIndicator.maximum += 1)),
                map(() => (this.approvalSuccessRate > 0 ? ++this.count : --this.count))
            );
        } else {
            barIndicator.maximum = this.approvalSuccessRate;
        }
    }
}
