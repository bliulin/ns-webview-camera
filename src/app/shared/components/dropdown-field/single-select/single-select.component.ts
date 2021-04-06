import { Component, Input, OnInit } from '@angular/core';
import { DataItem } from "~/app/shared/models/data-item";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { isAndroid } from "tns-core-modules/platform";
import { ModalDialogParams } from "nativescript-angular";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'omro-single-select',
    templateUrl: './single-select.component.html',
    styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnInit {

    private _searchedText: string = '';

    public items: Array<DataItem> = [];

    public displayedItems: ObservableArray<DataItem> = new ObservableArray<DataItem>();

    public field: DynamicFormFieldOuputModel;

    constructor(private _params: ModalDialogParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(_params.closeCallback);
        if (_params.context) {
            this.items = this.getItemsFromContext(_params.context);
            this.field = _params.context.field;
        }

        this.displayedItems = new ObservableArray<DataItem>(this.items);
    }

    public ngOnInit(): void {
    }

    public onSelectItem(args: any): void {
        const selectedItem: DataItem = (this._searchedText !== "") ?
            this.displayedItems.getItem(args.index) : this.items[args.index];
        this._params.closeCallback({
            selectedItem: selectedItem
        });
    }

    public searchBarLoaded(args: any): void {
        const searchBar = <SearchBar>args.object;
        searchBar.dismissSoftInput();

        if (isAndroid) {
            searchBar.android.clearFocus();
        }

        searchBar.text = "";
    }

    onTextChanged(args) {
        this.onSubmit(args);
    }

    onClear(args) {
        const searchBar = <SearchBar>args.object;
        searchBar.text = "";

        this.displayedItems = new ObservableArray<DataItem>();
        this.items.forEach(item => {
            this.displayedItems.push(item);
        });
    }

    onSubmit(args) {
        const searchBar = <SearchBar>args.object;
        const searchValue = searchBar.text.toLowerCase();
        this._searchedText = searchValue;

        this.displayedItems = new ObservableArray<DataItem>();
        if (searchValue !== "") {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].text.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                    this.displayedItems.push(this.items[i]);
                }
            }
        }
    }

    private getItemsFromContext(context: any): DataItem[] {
        const field: DynamicFormFieldOuputModel = context.field;
        if (!field) {
            return [];
        }

        const items: DataItem[] = [];
        Object.keys(field.possibleValues).map(key => items.push({
            value: key,
            text: field.possibleValues[key]
        }));
        return items;
    }
}
