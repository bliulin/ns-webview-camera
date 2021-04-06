import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "omro-carousel-select",
    moduleId: module.id,
    templateUrl: "./omro-carousel-select.component.html",
    styleUrls: ["./omro-carousel-select.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CarouselSelectComponent,
            multi: true
        }
    ]
})
export class CarouselSelectComponent implements ControlValueAccessor {
    @Input() public items: string[];
    @Input() public valueFormatter: (string) => string = (s) => s;
    public selectedItem: string;

    private onChange: (value: string) => void;
    private onTouched: () => void;

    public selectItem(item: string): void {
        this.selectedItem = item;
        this.onChange(item);
    }

    public writeValue(value: string): void {
        this.selectedItem = value;
    }

    public registerOnChange(onChange: (value: string) => void): void {
        this.onChange = onChange;
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    format(item: string) {
        return this.valueFormatter(item);
    }
}
