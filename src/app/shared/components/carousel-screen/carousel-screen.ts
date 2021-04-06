import { Component, Input } from '@angular/core';
import { device } from '@nativescript/core/platform';

@Component({
    selector: 'CarouselScreen',
    moduleId: module.id,
    templateUrl: './carousel-screen.html',
    styleUrls: ['carousel-screen.scss']
})
export class CarouselScreenComponent {
    public isTablet: boolean = device.deviceType === 'Tablet';

    @Input('imageName') public imageName: string;
    @Input('title') public title: string;
    @Input('description') public description: string;
}
