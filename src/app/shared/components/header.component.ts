import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="header-left">
        <button mat-icon-button class="menu-toggle">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">Dashboard Pro</span>
      </div>
      
      <div class="header-right">
        <mat-slide-toggle 
          [checked]="isDarkMode$ | async"
          (change)="toggleDarkMode()"
          class="dark-mode-toggle">
          <mat-icon>{{ (isDarkMode$ | async) ? 'dark_mode' : 'light_mode' }}</mat-icon>
        </mat-slide-toggle>
        
        <button mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .app-title {
      font-size: 24px;
      font-weight: 600;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ::ng-deep .dark-mode-toggle .mdc-switch {
      background-color: transparent;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isDarkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {}

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
