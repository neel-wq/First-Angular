import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStat } from '@core/models';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [class.trend-up]="stat.trend && stat.trend > 0">
      <div class="stat-content">
        <div class="stat-icon" [style.color]="stat.color">
          <mat-icon>{{ stat.icon }}</mat-icon>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">{{ stat.value }}</h3>
          <small class="stat-trend" *ngIf="stat.trend">
            <mat-icon>{{ stat.trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
            {{ stat.trend }}%
          </small>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
      font-size: 28px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .stat-value {
      margin: 5px 0;
      font-size: 28px;
      font-weight: 700;
      color: #333;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #27ae60;
      font-size: 12px;
      font-weight: 500;
    }

    .stat-card.trend-up .stat-trend {
      color: #27ae60;
    }

    :host-context(.dark-theme) .stat-card {
      background-color: #2a2a2a;
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .stat-label {
      color: #b0b0b0;
    }

    :host-context(.dark-theme) .stat-value {
      color: #e0e0e0;
    }
  `]
})
export class StatCardComponent {
  @Input() stat!: DashboardStat;
}
