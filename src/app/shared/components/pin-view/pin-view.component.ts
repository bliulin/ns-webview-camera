import { Component, Input, OnInit } from "@angular/core";

interface Digit {
    char?:string;
    focused?:boolean;
}

@Component({
    selector: "omro-pin-view",
    templateUrl: "./pin-view.component.html",
    styleUrls: ["./pin-view.component.scss"]
})
export class PinViewComponent{
    private digits:Digit[];
    private index=0;
    private _showError:boolean;
    private _shake: boolean;
    default = () => [{focused:true},{},{},{}];

    @Input() public showFocus:boolean;

    constructor(){
        this.digits = this.default();
    }

    showError() {
        this._showError = true;
        this.shake();
        this.reset();
    }

    public enterKey(char:string){
        const digit = this.digits[this.index];
        digit.char = char;
        digit.focused=false;
        if(this.index < this.digits.length - 1) {
            const nextDigit = this.digits[++this.index];
            nextDigit.focused = true;
        }
    }

    public reset(){
        this.index = 0;
        this.digits = this.default();
    }

    public shake(): void {
        this._shake = true;
        setTimeout(() => this._shake = false, 700);
    }
}
