import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { device } from '@nativescript/core/platform';
import { User } from '~/app/core/models/user.model';
import { UserProfileStateService } from '~/app/core/services/profile/user-profile-state.service';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'omro-no-card-added',
    templateUrl: './no-card-added.component.html',
    styleUrls: ['./no-card-added.component.scss']
})
export class NoCardAddedComponent extends BaseComponent implements OnInit {
    public user$: Observable<User>;
    @Output() addCardPressed = new EventEmitter();

    public isTablet: boolean = device.deviceType === 'Tablet';

    constructor(routerExtensions: RouterExtensions, private userProfileService: UserProfileStateService) {
        super(routerExtensions);
    }

    public ngOnInit(): void {
        this.user$ = this.userProfileService.user$;
    }

    public onValidateTap(): void {
        this.addCardPressed.emit();
    }
}
