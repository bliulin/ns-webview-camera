import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PinStateService {
    public pinIntroducedInThePreviousStep: string;
    public resetInputSubject: Subject<void> = new Subject<void>();

    public resetFormForPreviousStep(): void {
        this.resetInputSubject.next();
    }
}