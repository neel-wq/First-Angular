import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="(isLoading$ | async)">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <p class="loader-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .spinner-ring {
      border: 8px solid rgba(255, 255, 255, 0.3);
      border-top: 8px solid white;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loader-text {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class LoaderComponent implements OnInit {
  isLoading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {}
}
