import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountsRoutingModule } from './accounts-routing.module';
import { SharedModule } from '~/app/shared/shared.module';
import {
    NewAccountStartingPageComponent,
    AccountCardComponent,
    AccountDetailsComponent,
    SwitchCurrentAccountComponent,
    TransactionsCardComponent,
    CreateNewAccountComponent,
    TransactionDetailsComponent,
    AddAccountButtonComponent,
    StatementComponent
} from './components';
import { AccountHeaderComponent } from './shared/account-header/account-header.component';
import { AccountsComponent } from './accounts.component';

@NgModule({
    imports: [AccountsRoutingModule, SharedModule],
    declarations: [
        AccountsComponent,
        NewAccountStartingPageComponent,
        AccountCardComponent,
        AccountDetailsComponent,
        AccountHeaderComponent,
        SwitchCurrentAccountComponent,
        CreateNewAccountComponent,
        TransactionsCardComponent,
        TransactionDetailsComponent,
        AddAccountButtonComponent,
        StatementComponent
    ],
    entryComponents: [SwitchCurrentAccountComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AccountsModule {}
