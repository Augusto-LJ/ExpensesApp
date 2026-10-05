import { Component, computed, OnInit, signal } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CurrencyPipe, NgClass, DatePipe],
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

  constructor(private transactionService: TransactionService, private router: Router) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAll().subscribe((data: Transaction[]) => {
      this.transactions.set(data);
    });
  }

  editTransaction(transaction: Transaction): void {
    if (transaction.id) {
      this.router.navigate(['/edit', transaction.id]);
    }
  }

  deleteTransaction(transaction: Transaction): void {
    if (transaction.id) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => {
            this.loadTransactions();
          },
          error: (error) => {
            console.error('Error deleting transaction:', error);
          }
      });
    };
    }
  }
}
