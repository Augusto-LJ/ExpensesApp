import { Component, OnInit, signal } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  imports: [CurrencyPipe, NgClass],
  selector: 'app-transaction-list',
  styleUrl: './transaction-list.css',
  templateUrl: './transaction-list.html',
})

export class TransactionList implements OnInit {
  transactions = signal<Transaction[]>([]);

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAll().subscribe((data: Transaction[]) => {
      this.transactions.set(data);
    });
  }

  getTotalIncome() : number {
    return this.transactions()
               .filter((t: Transaction) => t.type === 'Income')
               .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }

  getTotalExpense() : number {
    return this.transactions()
               .filter((t: Transaction) => t.type === 'Expense')
               .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }

  getNetBalance() : number {
    return this.getTotalIncome() - this.getTotalExpense();
  }
}
