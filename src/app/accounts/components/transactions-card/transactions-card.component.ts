import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsStateService } from '../../services/accounts-state.service';
import { Transaction, TransactionCategory } from '../../models/api';
import { AccountTransactionIconHintDictionary } from '../../models';
@Component({
    selector: 'omro-transactions-card',
    templateUrl: './transactions-card.component.html',
    styleUrls: ['./transactions-card.component.scss']
})
export class TransactionsCardComponent  {
    public transactions$: Observable<Transaction[]>;

    public accountTransactionIconHintMapper: typeof AccountTransactionIconHintDictionary = AccountTransactionIconHintDictionary;
    public categoryCode: typeof TransactionCategory = TransactionCategory;

    @Output()
    public transactionTap: EventEmitter<string> = new EventEmitter();

    constructor(private stateService: AccountsStateService) {
        this.transactions$ = this.stateService.currentAccountTransactions$;
    }

    public getIconClass(code: TransactionCategory): string {
      switch (code) {
        case this.categoryCode.CardPayment:
        case this.categoryCode.IncomingCardTransfer:
          return 'default';

        case this.categoryCode.Payment:
        case this.categoryCode.Transfer:
          return 'rose';

        case this.categoryCode.Incoming:
          return 'sky-dark';
        default:
          break;
      }
    }

    public onTransactionTapped(transaction: Transaction) {
        this.transactionTap.emit(transaction.transactionId);
    }
}
