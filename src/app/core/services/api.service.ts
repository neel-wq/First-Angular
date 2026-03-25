import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
  }

  /**
   * Fetch all users
   */
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  /**
   * Fetch single user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  /**
   * Create new user
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.post<User>('/users', user);
  }

  /**
   * Update user
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.put<User>(`/users/${id}`, user);
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<any> {
    return this.delete<any>(`/users/${id}`);
  }
}
