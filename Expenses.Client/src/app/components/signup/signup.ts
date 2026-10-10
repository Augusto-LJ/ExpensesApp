import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-signup',
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup {
  signupForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control ? control.hasError(errorName) && (control.touched || control.dirty) : false;
  }

  passwordMatchValidator(fg: FormGroup) {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    const bothAreEqual = password === confirmPassword;

    return bothAreEqual ? null : { passwordMismatch: true };
  };

  onSubmit(): void{
    if (this.signupForm.valid) {
      const signUp = this.signupForm.value;
      this.authService.register(signUp).subscribe({
        next: () => {
          this.router.navigate(['/transactions']);
        },
        error: (error) => {
          console.error('Error during signup:', error);
          this.errorMessage = error.error?.message || 'An error occurred during signup. Please try again.';
        }
      });
    }
  }
}
