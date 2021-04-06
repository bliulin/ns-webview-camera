import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { isIOS } from 'tns-core-modules/ui/page/page';
@Component({
    selector: 'omro-file-action-bar',
    templateUrl: './file-action-bar.component.html',
    styleUrls: ['./file-action-bar.component.scss']
})
export class FileActionBarComponent implements OnChanges {
    public FileSelectionMode = FileSelectionMode;
    public fileSelectionMode: FileSelectionMode = FileSelectionMode.Deactivated;
    public isIos = isIOS;
    @Input()
    public showSelectButton: boolean = false;
    @Input()
    public title: string;
    @Output()
    public backTapped: EventEmitter<any> = new EventEmitter();
    @Output()
    public deleteTapped: EventEmitter<any> = new EventEmitter();
    @Output()
    public toggleSelection: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.showSelectButton) {
            const currentValue = changes.showSelectButton.currentValue;
            this.fileSelectionMode = !!currentValue ? FileSelectionMode.Visible : FileSelectionMode.Deactivated;
        }
    }

    onToggleSelection(value: boolean) {
        this.fileSelectionMode = value ? FileSelectionMode.Activated : FileSelectionMode.Visible;
        this.toggleSelection.emit(value);
    }

    deleteSelectedFiles() {
        this.deleteTapped.emit();
    }

    onBackTap() {
        this.backTapped.emit();
    }
}

export enum FileSelectionMode {
    Deactivated,
    Visible,
    Activated
}
