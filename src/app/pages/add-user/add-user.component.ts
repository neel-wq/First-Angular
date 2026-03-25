import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="add-user-container">
      <h1 class="page-title">Add New User</h1>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>User Registration Form</mat-card-title>
          <mat-card-subtitle>Fill in the form to create a new user</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <!-- Name Field -->
              <mat-form-field class="form-field">
                <mat-label>Name *</mat-label>
                <input 
                  matInput 
                  formControlName="name" 
                  placeholder="Enter user name"
                  required>
                <mat-error *ngIf="userForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
                <mat-error *ngIf="userForm.get('name')?.hasError('minlength')">
                  Name must be at least 3 characters
                </mat-error>
              </mat-form-field>

              <!-- Email Field -->
              <mat-form-field class="form-field">
                <mat-label>Email *</mat-label>
                <input 
                  matInput 
                  formControlName="email" 
                  placeholder="Enter email address"
                  type="email"
                  required>
                <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <!-- Username Field -->
              <mat-form-field class="form-field">
                <mat-label>Username *</mat-label>
                <input 
                  matInput 
                  formControlName="username" 
                  placeholder="Enter username"
                  required>
                <mat-error *ngIf="userForm.get('username')?.hasError('required')">
                  Username is required
                </mat-error>
              </mat-form-field>

              <!-- Phone Field -->
              <mat-form-field class="form-field">
                <mat-label>Phone</mat-label>
                <input 
                  matInput 
                  formControlName="phone" 
                  placeholder="Enter phone number">
              </mat-form-field>

              <!-- Website Field -->
              <mat-form-field class="form-field">
                <mat-label>Website</mat-label>
                <input 
                  matInput 
                  formControlName="website" 
                  placeholder="Enter website URL">
              </mat-form-field>

              <!-- Company Name Field -->
              <mat-form-field class="form-field">
                <mat-label>Company Name</mat-label>
                <input 
                  matInput 
                  formControlName="companyName" 
                  placeholder="Enter company name">
              </mat-form-field>

              <!-- Address Field -->
              <mat-form-field class="form-field">
                <mat-label>Address</mat-label>
                <input 
                  matInput 
                  formControlName="address" 
                  placeholder="Enter street address">
              </mat-form-field>

              <!-- City Field -->
              <mat-form-field class="form-field">
                <mat-label>City</mat-label>
                <input 
                  matInput 
                  formControlName="city" 
                  placeholder="Enter city">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="!userForm.valid || isSubmitting">
                <span *ngIf="!isSubmitting">Create User</span>
                <mat-spinner 
                  *ngIf="isSubmitting" 
                  diameter="20"
                  strokeWidth="2">
                </mat-spinner>
              </button>

              <button 
                mat-stroked-button 
                type="button"
                (click)="resetForm()">
                Reset Form
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .add-user-container {
      padding: 20px 0;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-title {
      margin: 0 0 20px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .form-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    button {
      min-width: 150px;
    }

    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    :host-context(.dark-theme) .page-title {
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .form-card {
      background-color: #2a2a2a;
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .form-actions {
      border-top-color: #333;
    }
  `]
})
export class AddUserComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: [''],
      website: [''],
      companyName: [''],
      address: [''],
      city: ['']
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    const formData: Partial<User> = {
      name: this.userForm.get('name')?.value,
      email: this.userForm.get('email')?.value,
      username: this.userForm.get('username')?.value,
      phone: this.userForm.get('phone')?.value,
      website: this.userForm.get('website')?.value,
      company: {
        name: this.userForm.get('companyName')?.value || '',
        catchPhrase: '',
        bs: ''
      },
      address: {
        street: this.userForm.get('address')?.value || '',
        city: this.userForm.get('city')?.value || '',
        zipcode: ''
      }
    };

    this.apiService.createUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: User) => {
          this.isSubmitting = false;
          this.snackBar.open('User created successfully!', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.resetForm();
        },
        (error) => {
          this.isSubmitting = false;
          console.error('Error creating user:', error);
          this.snackBar.open('Error creating user. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      );
  }

  resetForm(): void {
    this.userForm.reset();
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
  }
}
