import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '@shared/components/header.component';
import { SidebarComponent } from '@shared/components/sidebar.component';
import { LoaderComponent } from '@shared/components/loader.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent
  ],
  template: `
    <div class="layout">
      <app-header></app-header>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav class="sidebar-sidenav" mode="side" opened>
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        
        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
      
      <app-loader></app-loader>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .sidenav-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar-sidenav {
      width: 250px;
      border-right: 1px solid #e0e0e0;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f5f5;
      padding: 20px;
    }

    :host-context(.dark-theme) .main-content {
      background-color: #1a1a1a;
    }

    :host-context(.dark-theme) .sidebar-sidenav {
      border-right-color: #333;
    }
  `]
})
export class LayoutComponent {}
