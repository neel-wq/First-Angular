export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

export interface TableState {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface DashboardStat {
  label: string;
  value: number | string;
  icon: string;
  trend?: number;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
}
