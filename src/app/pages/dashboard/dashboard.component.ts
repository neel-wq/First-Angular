import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StatCardComponent } from '@shared/components/stat-card.component';
import { DashboardStat, ChartData } from '@core/models';
import { ApiService } from '@core/services/api.service';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    StatCardComponent,
    NgxEchartsModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">Dashboard Overview</h1>
      
      <!-- Statistics Cards -->
      <mat-grid-list cols="3" rowHeight="150px" class="stats-grid" [gutterSize]="20">
        <mat-grid-tile *ngFor="let stat of stats">
          <app-stat-card [stat]="stat"></app-stat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Charts Section -->
      <div class="charts-container">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Users by Region</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div echarts [options]="pieChartOptions" [style]="{ height: '300px' }"></div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Monthly Revenue</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div echarts [options]="barChartOptions" [style]="{ height: '300px' }"></div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px 0;
    }

    .page-title {
      margin: 0 0 30px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .stats-grid {
      margin-bottom: 30px;
    }

    .charts-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 30px;
    }

    .chart-card {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 1024px) {
      .charts-container {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        cols: 2 !important;
      }
    }

    :host-context(.dark-theme) .page-title {
      color: #e0e0e0;
    }

    :host-context(.dark-theme) .chart-card {
      background-color: #2a2a2a;
      color: #e0e0e0;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  stats: DashboardStat[] = [];
  pieChartOptions: any = {};
  barChartOptions: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.initializeStatistics();
    this.initializeCharts();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeStatistics(): void {
    this.stats = [
      {
        label: 'Total Users',
        value: 0,
        icon: 'people',
        trend: 12,
        color: '#667eea'
      },
      {
        label: 'Total Revenue',
        value: '$0',
        icon: 'trending_up',
        trend: 8,
        color: '#27ae60'
      },
      {
        label: 'Total Orders',
        value: 0,
        icon: 'shopping_cart',
        trend: 5,
        color: '#f39c12'
      }
    ];
  }

  private loadUserData(): void {
    this.apiService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (users) => {
          if (users && users.length > 0) {
            this.stats[0].value = users.length;
          }
        },
        (error) => {
          console.error('Error loading users:', error);
        }
      );
  }

  private initializeCharts(): void {
    // Pie Chart Options
    this.pieChartOptions = {
      title: {
        text: 'Users by Region',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Users',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'North' },
            { value: 735, name: 'South' },
            { value: 580, name: 'East' },
            { value: 484, name: 'West' },
            { value: 300, name: 'Central' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // Bar Chart Options
    this.barChartOptions = {
      title: {
        text: 'Monthly Revenue',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Revenue',
          data: [120, 200, 150, 80, 70, 110, 130, 200, 180, 220, 250, 300],
          type: 'bar',
          itemStyle: {
            color: '#667eea'
          },
          smooth: true
        }
      ]
    };
  }
}
