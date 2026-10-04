import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';

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

  constructor(private fb: FormBuilder, private router: Router, private translationService: TransactionService) {
    this.transactionForm = fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

    updateAvailableCategories(): void {
    const type = this.transactionForm.get('type')?.value;
    this.availableCategories = type === 'Income' ? this.incomeCategories : this.expenseCategories;
    this.transactionForm.patchValue({ category: '' });
  }

  ngOnInit(): void {
    this.updateAvailableCategories();
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  onTypeChange(): void {
    this.updateAvailableCategories();
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;

      this.translationService.create(transactionData).subscribe(data => {
        console.log('Transaction created:', data);
        this.router.navigate(['/transactions']);
      });
    }
  }
}
