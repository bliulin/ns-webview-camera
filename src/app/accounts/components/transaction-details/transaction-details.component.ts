import { Component, OnInit } from '@angular/core';
import { combineLatest } from "rxjs";
import { Page } from 'tns-core-modules/ui/page/page';
import { AccountsStateService } from "~/app/accounts/services/accounts-state.service";
import { ActivatedRoute } from "@angular/router";
import { map, take } from "rxjs/internal/operators";
import { Transaction } from "~/app/accounts/models/api/transaction";
import { BaseComponent } from "~/app/shared/base.component";
import { RouterExtensions } from 'nativescript-angular';
import { TransactionCategory } from "~/app/accounts/models/api/transactionCategory";
import { TransactionStatus } from "~/app/accounts/models/api";
import { traceError } from "~/app/core/logging/logging-utils";

@Component({
    selector: 'ns-transaction-details',
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent extends BaseComponent implements OnInit {
    public TransactionCategory = TransactionCategory;
    public vm: { transaction?: Transaction } = {};

    constructor(private page: Page,
                private accountStateService: AccountsStateService,
                private activatedRoute: ActivatedRoute,
                public routerExtensions: RouterExtensions) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public get showSendConfirmationText(): boolean {
        return this.vm.transaction.statusCode === TransactionStatus.Executed;
    }

    public ngOnInit(): void {
        const transactionId = this.activatedRoute.snapshot.paramMap.get('id');
        combineLatest([this.accountStateService.currentAccount$, this.accountStateService.currentAccountTransactions$]).pipe(
            map(([account, transactions]) => [account, transactions.find(t => t.transactionId === transactionId)]),
            take(1)
        ).subscribe(([account, tran]) => {
            if (!tran) {
                traceError('Transaction is null!');
                return;
            }
            this.vm.transaction = tran;
            if (this.vm.transaction.categoryCode === TransactionCategory.Transfer) {
                this.vm.transaction = TransferTransaction.createModel(tran, account.name);
            }
        });
    }

    public goBack(): void {
        if (this.routerExtensions.canGoBackToPreviousPage()) {
            super.goBack();
        }
        else {
            super.navigateToDashboard('transfers');
        }
    }
}

class TransferTransaction implements Transaction {
    public static createModel(transaction: Transaction, accountName: string): TransferTransaction {
        let tt: TransferTransaction = new TransferTransaction();
        Object.assign(tt, transaction);

        tt.fromAccount = tt.amount < 0 ? accountName : tt.otherPartyName;
        tt.intoAccount = tt.amount < 0 ? tt.otherPartyName : accountName;

        return tt;
    }

    public fromAccount?: string;
    public intoAccount?: string;

    public transactionId?: string;
    public name?: string;
    public valueDate?: Date;
    public bookedDate?: Date;
    public amount?: number;
    public currencyPair?: string;
    public fxRate?: number;
    public currencyCode?: string;
    public isBooked?: boolean;
    public statusName?: string;
    public categoryCode?: TransactionCategory;
    public categoryName?: string;
    public otherPartyName?: string;
    public otherPartyAccount?: string;
    public otherPartyBank?: string;
    public transactionReference?: string;
    public filboFee?: number;
    public interchangeFee?: number;
}
