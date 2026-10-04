import { Component } from '@angular/core';
import { Transaction } from '../../models/transaction';

@Component({
  imports: [],
  selector: 'app-transaction-list',
  styleUrl: './transaction-list.css',
  templateUrl: './transaction-list.html',
})

export class TransactionList {
  transactions : Transaction[] = [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'Food',
      type: 'Expense',
      amount: 100,
    },
    {
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'Lux',
      type: 'Expense',
      amount: 90,
    }
  ];

}
