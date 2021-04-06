import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    AfterViewInit, OnChanges, SimpleChanges, OnDestroy
} from "@angular/core";
import { Canvas, CanvasView, Paint } from "nativescript-canvas";
import { Color, ContentView } from "tns-core-modules/ui/page/page";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { registerElement } from "nativescript-angular";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subject, timer } from "rxjs";
import { switchMap, takeUntil } from "rxjs/internal/operators";
import { filter } from "rxjs/internal/operators/filter";

registerElement("CanvasView", () => CanvasView);
registerElement("omro-price-wheel", () => PriceWheelComponent);

interface Constants {
    tickHeight: number;
    bigTickHeight: number;
    barHeight: number;
    tickSpace: number;
    bigTickPeriod: number;
}

interface DrawContext {
    i: number;
    x: number;
    width: number;
    centerX: number;
    centerY: number;
}

const Consts: Constants = {
    tickHeight: 20,
    bigTickHeight: 25,
    barHeight: 70,
    tickSpace: 12,
    bigTickPeriod: 5
};

@Component({
    selector: "omro-price-wheel",
    templateUrl: "./price-wheel.component.html",
    styleUrls: ["./price-wheel.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PriceWheelComponent,
            multi: true
        }
    ]
})
export class PriceWheelComponent extends ContentView implements OnChanges, AfterViewInit, ControlValueAccessor, OnDestroy {
    private readonly backPaint: Paint;
    private tickPaint: Paint;
    private barPaint: Paint;
    private _tickColor: Color;
    private _barColor: Color;

    private absoluteValue: number = 0;
    private _value: number = 0;

    private startOffset: number = 0;
    private panOffset: number = 0;
    private tempOffset: number = 0;
    private offset: number = 0;
    private scrolling: boolean = false;
    private panSubject: Subject<PanGestureEventData> = new Subject<PanGestureEventData>();
    private externalPanSubject: Subject<PanGestureEventData> = new Subject<PanGestureEventData>();
    private unsubscribe = new Subject();

    @ViewChild("canvas", {static: true})
    canvas: ElementRef<CanvasView>;

    private onChange: (value: number) => void = () => {
    };

    @Input() public minValue: number = 0;
    @Input() public maxValue: number = 0;
    @Input() public step: number = 1;
    @Input() public scrollView: ScrollView;

    constructor() {
        super();
        this.backPaint = new Paint();
        this.backPaint.setColor("#ffffff");
    }

    @Input() get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.absoluteValue = value;
    }

    get tickColor(): Color {
        return this._tickColor;
    }

    @Input() set tickColor(value: Color) {
        this._tickColor = value;
        this.tickPaint = new Paint();
        this.tickPaint.setColor(value);
    }

    get barColor(): Color {
        return this._barColor;
    }

    @Input() set barColor(value: Color) {
        this._barColor = value;
        this.barPaint = new Paint();
        this.barPaint.setColor(value);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.canvas.nativeElement.redraw();
    }

    public ngAfterViewInit(): void {
        this.canvas.nativeElement.redraw();
        if (this.scrollView) {
            this.scrollView.on('pan', (args: PanGestureEventData) => this.externalPanSubject.next(args));
        }
        this.initObservables();
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.panSubject.complete();
        this.externalPanSubject.complete();
    }

    onPan(val: PanGestureEventData) {
        this.panSubject.next(val);
    }

    public writeValue(value: number): void {
        this.value = value | 0;
    }

    public registerOnChange(onChange: (value: number) => void): void {
        this.onChange = onChange;
    }

    // needed to properly implement ControlValueAccessor interface
    public registerOnTouched() {
    }

    draw(event: { canvas: Canvas }) {
        const c = event.canvas;
        const ctx: DrawContext = {
            i: 0,
            x: 10,
            width: c.getWidth(),
            centerX: c.getWidth() / 2,
            centerY: c.getHeight() / 2
        };
        c.drawRect(0, 0, c.getWidth(), c.getHeight(), this.backPaint); //clear screen

        const totalTicks = (this.maxValue - this.minValue) / this.step;
        const valueOffset = ((this.absoluteValue - this.minValue) / this.step) * Consts.tickSpace;

        while (ctx.i <= totalTicks) {
            ctx.x = ctx.centerX - valueOffset + ctx.i * Consts.tickSpace;

            if (!this.isOutOfBouds(ctx)) {
                if (ctx.i % Consts.bigTickPeriod === Consts.bigTickPeriod - 1) {
                    this.drawBigTick(c, ctx);
                } else {
                    this.drawSmallTick(c, ctx);
                }
            }

            ctx.i++;
        }

        this.drawCenterBar(c, ctx);
    }

    private initObservables() {
        this.panSubject
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(v => this.onInternalPan(v));

        this.externalPanSubject
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(v => this.onExternalPan(v));

        // This is done to stop the parent ScrollView from highjacking the (pan) event of our GridLayout
        this.panSubject
            .pipe(takeUntil(this.unsubscribe))
            .pipe(filter(v => v.state === 3))
            .pipe(switchMap(v => {
                return this.externalPanSubject
                    .pipe(filter(v => v.state === 1))
                    .pipe(takeUntil(timer(200)));
            }))
            .subscribe(v => {
                this.scrolling = true;
                this.doScroll(v);
            });
    }

    onInternalPan(val: PanGestureEventData) {
        if (val.state === 1) {
            this.scrolling = true;
        } else if (val.state === 3) {
            this.scrolling = false;
        }
        this.doScroll(val);
    }

    onExternalPan(val: PanGestureEventData) {
        if (!this.scrolling) {
            return;
        }

        this.doScroll(val);
        if (val.state === 3) {
            this.scrolling = false;
        }
    }

    public doScroll(val) {
        const delta = -(val.deltaX / Consts.tickSpace) * this.step;

        let newValue = this._value + delta;

        newValue = this.getInRange(newValue);
        const actualDelta = newValue - this._value;
        const actualDeltaX = -(actualDelta * Consts.tickSpace) / this.step;

        this.absoluteValue = newValue;
        newValue = this.roundToStep(newValue);

        const bigTickSpace = Consts.bigTickPeriod * Consts.tickSpace;
        if (val.state === 2) {
            this.tempOffset = actualDeltaX % bigTickSpace;
        } else if (val.state === 3) {
            this.panOffset = (this.panOffset + this.tempOffset) % bigTickSpace;
            this.tempOffset = 0;
            this._value = newValue;
        }

        this.offset =
            this.startOffset +
            ((this.panOffset + this.tempOffset) % bigTickSpace);
        this.onChange(newValue);
        this.canvas.nativeElement.redraw();
    }

    private getInRange(newValue) {
        return Math.min(Math.max(newValue, this.minValue), this.maxValue);
    }

    private roundToStep(newValue) {
        if (newValue === Number(this.minValue) || newValue === Number(this.maxValue)) {
            return newValue;
        }
        newValue = Math.round(newValue / this.step) * this.step;
        return this.getInRange(newValue);
    }

    private isOutOfBouds(ctx: DrawContext) {
        return ctx.x < 0 || ctx.x > ctx.width;
    }

    private drawCenterBar(c: Canvas, ctx: DrawContext) {
        const top = ctx.centerY - Consts.barHeight / 2;

        c.drawRoundRect(
            ctx.centerX - 2,
            top,
            ctx.centerX + 2,
            top + Consts.barHeight,
            8,
            8,
            this.barPaint
        );
    }

    private drawSmallTick(c, ctx: DrawContext) {
        c.drawRoundRect(
            ctx.x,
            ctx.centerY - Consts.tickHeight / 2,
            ctx.x + 2,
            ctx.centerY + Consts.tickHeight / 2,
            8,
            8,
            this.tickPaint
        );
    }

    private drawBigTick(c: Canvas, ctx: DrawContext) {
        //decrease height as we move away from center
        const ratioFromCenter = 1 - Math.abs(ctx.x - ctx.centerX) / ctx.centerX;
        const adjustedBigTickHeight =
            Consts.bigTickHeight + 15 * ratioFromCenter;

        let top = ctx.centerY - adjustedBigTickHeight / 2;
        let bottom = top + adjustedBigTickHeight;

        c.drawRoundRect(
            ctx.x - 1,
            top,
            ctx.x + 3,
            bottom,
            8,
            8,
            this.tickPaint
        );
    }
}
