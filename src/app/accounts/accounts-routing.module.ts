import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AccountsComponent } from './accounts.component';
import {
    StatementComponent,
    CreateNewAccountComponent,
    TransactionDetailsComponent,
    AccountDetailsComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: AccountsComponent
    },
    {
        path: 'account-details',
        component: AccountDetailsComponent
    },
    {
        path: 'create-account',
        component: CreateNewAccountComponent
    },
    {
        path: 'transaction/:id/details',
        component: TransactionDetailsComponent
    },
    {
        path: 'statement',
        component: StatementComponent
    }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AccountsRoutingModule {}
