import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User, TableState } from '@core/models';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="users-container">
      <h1 class="page-title">Users Management</h1>

      <mat-card class="users-card">
        <mat-card-header>
          <mat-card-title>Users List</mat-card-title>
          <mat-card-subtitle>{{ users.length }} users found</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="table-wrapper">
            <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSortChange($event)" class="users-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let element">{{ element.id }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let element">{{ element.name }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let element">{{ element.email }}</td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let element">{{ element.phone || 'N/A' }}</td>
              </ng-container>

              <!-- Website Column -->
              <ng-container matColumnDef="website">
                <th mat-header-cell *matHeaderCellDef>Website</th>
                <td mat-cell *matCellDef="let element">{{ element.website || 'N/A' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element" class="actions-cell">
                  <button mat-icon-button matTooltip="View details" (click)="viewUser(element)">
                    <mat-icon>info</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete user" (click)="deleteUser(element.id)" color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="user-row"></tr>
            </table>
          </div>

          <mat-paginator 
            [length]="users.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px 0;
    }

    .page-title {
      margin: 0 0 20px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .users-card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .table-wrapper {
      overflow-x: auto;
      margin: 20px 0;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
      padding: 15px;
      text-align: left;
      border-bottom: 2px solid #e0e0e0;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .user-row:hover {
      background-color: #fafafa;
    }

    .actions-cell {
      display: flex;
      gap: 5px;
    }

    mat-paginator {
      border-top: 1px solid #e0e0e0;
    }

    :host-context(.dark-theme) .page-title {
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .users-card {
      background-color: #2a2a2a;
      color: #e0e0e0;
    }

    :host-context(.dark-theme) th {
      background-color: #1e1e1e;
      border-bottom-color: #333;
    }

    :host-context(.dark-theme) td {
      border-bottom-color: #333;
    }

    :host-context(.dark-theme) .user-row:hover {
      background-color: #333;
    }
  `]
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator: any;

  users: User[] = [];
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'website', 'actions'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  isLoading = false;

  private destroy$ = new Subject<void>();
  private tableState: TableState = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: '',
    sortDirection: 'asc'
  };

  constructor(private apiService: ApiService) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: User[]) => {
          this.users = data;
          this.dataSource.data = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      );
  }

  onPageChange(event: PageEvent): void {
    this.tableState.pageIndex = event.pageIndex;
    this.tableState.pageSize = event.pageSize;
  }

  onSortChange(sort: Sort): void {
    this.tableState.sortBy = sort.active;
    this.tableState.sortDirection = sort.direction as 'asc' | 'desc';
    
    if (sort.direction) {
      const isAsc = sort.direction === 'asc';
      this.dataSource.data = [...this.dataSource.data].sort((a: any, b: any) => {
        const aVal = a[sort.active];
        const bVal = b[sort.active];
        return (aVal < bVal ? -1 : 1) * (isAsc ? 1 : -1);
      });
    }
  }

  viewUser(user: User): void {
    console.log('View user:', user);
    alert(`User: ${user.name}\nEmail: ${user.email}`);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.users = this.users.filter(u => u.id !== id);
            this.dataSource.data = this.users;
            console.log('User deleted successfully');
          },
          (error) => {
            console.error('Error deleting user:', error);
          }
        );
    }
  }
}
