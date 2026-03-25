import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2>Menu</h2>
      </div>
      
      <mat-nav-list>
        <mat-list-item 
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item">
          <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
          <span class="nav-label">{{ item.label }}</span>
        </mat-list-item>
      </mat-nav-list>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #f5f5f5;
      border-right: 1px solid #e0e0e0;
      height: 100%;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #f9f9f9;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    mat-nav-list {
      padding: 10px 0;
    }

    .nav-item {
      padding: 0 20px;
      height: 50px;
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background-color: #e8e8e8;
    }

    .nav-item.active {
      background-color: #667eea;
      color: white;
    }

    .nav-icon {
      font-size: 20px;
    }

    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }

    :host-context(.dark-theme) .sidebar {
      background-color: #1e1e1e;
      border-right-color: #333;
    }

    :host-context(.dark-theme) .sidebar-header {
      background-color: #2a2a2a;
      border-bottom-color: #333;
    }

    :host-context(.dark-theme) .sidebar-header h2 {
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .nav-item:hover {
      background-color: #333;
    }

    :host-context(.dark-theme) .nav-item.active {
      background-color: #667eea;
    }
  `]
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Add User', icon: 'person_add', route: '/add-user' }
  ];

  ngOnInit(): void {}
}
