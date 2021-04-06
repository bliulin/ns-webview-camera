import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";

@Component({
    selector: "omro-small-card",
    templateUrl: "./small-card.component.html",
    styleUrls: ["./small-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallCardComponent {
    @Input() buttonText: string;
    @Input() details: string;
    @Input() imageSrc: string;
    @Output() buttonTap: EventEmitter<any> = new EventEmitter<any>();

    onTap() {
        this.buttonTap.emit();
    }
}
