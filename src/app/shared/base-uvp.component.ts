import { Carousel } from 'nativescript-carousel';
import { screen } from 'tns-core-modules/platform/platform';
import { isAndroid, Color } from 'tns-core-modules/ui/page/page';
import { ElementRef, OnInit, ViewChild } from '@angular/core';

const filboLogoPath = "~/app/images/filbo.svg";

/* 
-- Currently each uvp contains 3 static screens. 
-- In case of adding one more screen for one of the uvp's <lastPageIndex> will need to be moved in child classes and updated with the corresponding value.
*/
const lastPageIndex = 2;

/* Warning - do not change this default values */
const optimalYoffsetIos = -20;
const optimalYoffsetAndroid = -5;

/* In case of theme change this colors will need to be updated */
const defaultIndicatorColor = '#54C0EE';
const defaultIndicatorColorUnselected = '#D6D9E0';

export abstract class BaseUvpComponent implements OnInit{
    @ViewChild('carousel', { static: true }) public carouselRef: ElementRef<Carousel>;
    protected logo: string = filboLogoPath;

    protected offsetX: number;
    protected offsetY: number;

    protected indicatorColor: Color;
    protected indicatorColorUnselected: Color;

    public selectedScreenIndex: number;

    constructor() {
        this.selectedScreenIndex = 0;
    }

    public ngOnInit(): void {
        this.computeOffsetsForIndicator();
        this.setColorsForIndicator();
    }

    protected updateSelectedScreenIndex(index: number): void {
        this.selectedScreenIndex = index;
    }

    protected handleButtonTap(): void {
        if (this.selectedScreenIndex < lastPageIndex) {
            this.carouselRef.nativeElement.selectedPage++;
        } else {
            this.finish();
        }
    }

    protected abstract finish();

    private setColorsForIndicator(): void {
        this.indicatorColor = new Color(defaultIndicatorColor);
        this.indicatorColorUnselected = new Color(defaultIndicatorColorUnselected);
    }

    private computeOffsetsForIndicator(): void {
        const generalComputation = (screen.mainScreen.widthDIPs / 2) * -1 + 40;
        if (isAndroid) {
            this.offsetX = generalComputation * 2;
            this.offsetY = optimalYoffsetAndroid;
        } else {
            this.offsetX = generalComputation;
            this.offsetY = optimalYoffsetIos;
        }
    }


}
