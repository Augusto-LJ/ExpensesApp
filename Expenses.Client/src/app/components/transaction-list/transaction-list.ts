import { Component, computed, OnInit, signal } from '@angular/core';
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
  totalIncome = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  
  netBalance = computed(() => this.totalIncome() - this.totalExpense());

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAll().subscribe((data: Transaction[]) => {
      this.transactions.set(data);
    });
  }

}
