import { Component, OnInit } from '@angular/core';
import { AuthorizationResult } from '../authorization-result';
import { UnlockService } from '~/app/core/services/unlock.service';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'omro-unlock-screen',
    templateUrl: './unlock-screen.component.html',
    styleUrls: ['./unlock-screen.component.scss']
})
export class UnlockScreenComponent implements OnInit {
    constructor(private unlockService: UnlockService, private routerExt: RouterExtensions) {}

    ngOnInit() {}

    public onAuthComplete(result: AuthorizationResult) {
        switch (result) {
            case AuthorizationResult.Success:
                this.unlockService.unlock();
                break;
            case AuthorizationResult.TooManyAtempts:
                this.routerExt.navigate(['login', 'logout'], { clearHistory: true });
                break;
        }
    }

    public onTapForgotPin(): void {}
}
