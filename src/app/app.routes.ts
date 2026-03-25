import { Routes } from '@angular/router';
import { LayoutComponent } from '@core/layouts/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('@pages/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'add-user',
        loadComponent: () => import('@pages/add-user/add-user.component').then(m => m.AddUserComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
