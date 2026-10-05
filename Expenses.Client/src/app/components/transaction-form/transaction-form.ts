import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-transaction-form',
  styleUrl: './transaction-form.css',
  templateUrl: './transaction-form.html',
})

export class TransactionForm {
  transactionForm: FormGroup;
  incomeCategories = ['Salary', 'Business', 'Freelance', 'Investment', 'Other'];
  expenseCategories = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];
  availableCategories: string[] = [];
  editMode: boolean = false;
  transactionId?: number;

  constructor(private fb: FormBuilder,
              private router: Router,
              private transactionService: TransactionService,
              private activatedRoute: ActivatedRoute
            ) {
    this.transactionForm = fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

    updateAvailableCategories(type: string): void {
    this.availableCategories = type === 'Income' ? this.incomeCategories : this.expenseCategories;
    this.transactionForm.patchValue({ category: '' });
  }

  ngOnInit(): void {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.transactionId = +id;
      this.loadTransaction(this.transactionId);
    }
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  onTypeChange(): void {
    const type = this.transactionForm.get('type')?.value;
    this.updateAvailableCategories(type);
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;

      if (this.editMode && this.transactionId) {
        this.transactionService.update(this.transactionId, transactionData).subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (error) => {
            console.error('Error updating transaction:', error);
          }
        });
      } else {
        this.transactionService.create(transactionData).subscribe({
          next: () => {
            this.router.navigate(['/transactions']);
          },
          error: (error) => {
            console.error('Error creating transaction:', error);
            this.router.navigate(['/transactions']);
          }
        });
      }
    }
  }

  loadTransaction(id: number): void {
    this.transactionService.getById(id).subscribe({
      next: (transaction: Transaction) => {
        this.updateAvailableCategories(transaction.type);
        this.transactionForm.patchValue({
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
        });
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
      }
    });
  }
}
