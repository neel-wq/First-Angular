# Angular 20 Dashboard - API & Services Documentation

## 📚 Table of Contents

1. [API Service](#api-service)
2. [Loader Service](#loader-service)
3. [Theme Service](#theme-service)
4. [HTTP Interceptor](#http-interceptor)
5. [Models & Interfaces](#models--interfaces)
6. [Usage Examples](#usage-examples)

---

## API Service

**File**: `src/app/core/services/api.service.ts`

Generic HTTP service wrapper for making API requests.

### Methods

#### `get<T>(endpoint: string, params?: any): Observable<T>`

Make a GET request to the specified endpoint.

**Parameters:**
- `endpoint` (string): API endpoint (e.g., `/users`)
- `params` (object, optional): Query parameters

**Returns:** Observable of type T

**Example:**
```typescript
this.apiService.get<User>('/users/1').subscribe(user => {
  console.log(user);
});

// With query params
this.apiService.get<User[]>('/users', { role: 'admin' }).subscribe(users => {
  console.log(users);
});
```

#### `post<T>(endpoint: string, data: any): Observable<T>`

Make a POST request to create a resource.

**Parameters:**
- `endpoint` (string): API endpoint
- `data` (any): Request body

**Returns:** Observable of type T

**Example:**
```typescript
const newUser = { name: 'John', email: 'john@example.com' };
this.apiService.post<User>('/users', newUser).subscribe(created => {
  console.log('User created:', created);
});
```

#### `put<T>(endpoint: string, data: any): Observable<T>`

Make a PUT request to update a resource.

**Parameters:**
- `endpoint` (string): API endpoint
- `data` (any): Request body

**Returns:** Observable of type T

**Example:**
```typescript
const updated = { name: 'Jane' };
this.apiService.put<User>('/users/1', updated).subscribe(user => {
  console.log('User updated:', user);
});
```

#### `delete<T>(endpoint: string): Observable<T>`

Make a DELETE request to remove a resource.

**Parameters:**
- `endpoint` (string): API endpoint

**Returns:** Observable of type T

**Example:**
```typescript
this.apiService.delete<void>('/users/1').subscribe(() => {
  console.log('User deleted');
});
```

#### `getUsers(): Observable<User[]>`

Fetch all users from the API.

**Returns:** Observable<User[]>

**Example:**
```typescript
this.apiService.getUsers().subscribe(users => {
  this.users = users;
});
```

#### `getUserById(id: number): Observable<User>`

Fetch a single user by ID.

**Parameters:**
- `id` (number): User ID

**Returns:** Observable<User>

**Example:**
```typescript
this.apiService.getUserById(1).subscribe(user => {
  this.currentUser = user;
});
```

#### `createUser(user: Partial<User>): Observable<User>`

Create a new user.

**Parameters:**
- `user` (Partial<User>): User data

**Returns:** Observable<User>

**Example:**
```typescript
const user = { name: 'Alice', email: 'alice@example.com' };
this.apiService.createUser(user).subscribe(created => {
  console.log('Created:', created);
});
```

#### `updateUser(id: number, user: Partial<User>): Observable<User>`

Update an existing user.

**Parameters:**
- `id` (number): User ID
- `user` (Partial<User>): Updated user data

**Returns:** Observable<User>

**Example:**
```typescript
this.apiService.updateUser(1, { name: 'Bob' }).subscribe(updated => {
  console.log('Updated:', updated);
});
```

#### `deleteUser(id: number): Observable<any>`

Delete a user.

**Parameters:**
- `id` (number): User ID

**Returns:** Observable<any>

**Example:**
```typescript
this.apiService.deleteUser(1).subscribe(() => {
  console.log('Deleted successfully');
});
```

---

## Loader Service

**File**: `src/app/core/services/loader.service.ts`

Manages global loading state across the application.

### Properties

#### `loading$: Observable<boolean>`

Observable stream of loading state changes.

**Example:**
```typescript
this.loaderService.loading$.subscribe(isLoading => {
  console.log('Is loading:', isLoading);
});
```

### Methods

#### `show(): void`

Show the global loader.

**Example:**
```typescript
this.loaderService.show();
```

#### `hide(): void`

Hide the global loader.

**Example:**
```typescript
this.loaderService.hide();
```

#### `isLoading(): boolean`

Get current loading state synchronously.

**Returns:** boolean - True if loading, false otherwise

**Example:**
```typescript
if (this.loaderService.isLoading()) {
  console.log('App is currently loading');
}
```

### Complete Usage Example

```typescript
export class MyComponent implements OnInit {
  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.loaderService.loading$.subscribe(isLoading => {
      if (isLoading) {
        console.log('Loading started');
      } else {
        console.log('Loading finished');
      }
    });

    // Show loader
    this.loaderService.show();

    // Do async work...
    setTimeout(() => {
      this.loaderService.hide();
    }, 2000);
  }
}
```

---

## Theme Service

**File**: `src/app/core/services/theme.service.ts`

Handles dark mode toggle and theme persistence.

### Properties

#### `darkMode$: Observable<boolean>`

Observable stream of dark mode changes.

**Example:**
```typescript
this.themeService.darkMode$.subscribe(isDark => {
  console.log('Dark mode enabled:', isDark);
});
```

#### `isDarkMode: Signal<boolean>`

Modern Angular Signal for dark mode state.

**Example:**
```typescript
const isDark = this.themeService.isDarkMode(); // Reactive value
```

### Methods

#### `toggleDarkMode(): void`

Toggle between dark and light themes. Persists to localStorage.

**Example:**
```typescript
// Toggle theme
this.themeService.toggleDarkMode();

// Get current state
const isDark = this.themeService.isDarkModeActive();
```

#### `isDarkModeActive(): boolean`

Get current dark mode state synchronously.

**Returns:** boolean - True if dark mode is active

**Example:**
```typescript
if (this.themeService.isDarkModeActive()) {
  // Adjust component for dark mode
}
```

### Complete Usage Example

```typescript
export class ThemeToggleComponent {
  isDarkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemeService) {}

  onToggle(): void {
    this.themeService.toggleDarkMode();
  }
}
```

**Template:**
```html
<mat-slide-toggle 
  [checked]="isDarkMode$ | async"
  (change)="onToggle()">
  Dark Mode
</mat-slide-toggle>
```

---

## HTTP Interceptor

**File**: `src/app/core/interceptors/http-loader.interceptor.ts`

Automatically shows/hides loader during HTTP requests.

### How It Works

1. On HTTP request start → Show loader
2. Track multiple concurrent requests
3. When all requests complete → Hide loader
4. Handles errors gracefully

### Configuration

#### Exempt URLs from Loader

To prevent certain API calls from showing the loader:

```typescript
// In http-loader.interceptor.ts
private isExemptFromLoader(url: string): boolean {
  const exemptUrls = ['/health-check', '/ping'];
  return exemptUrls.some(exemptUrl => url.includes(exemptUrl));
}
```

### Example

```typescript
// This automatically shows loader
this.apiService.getUsers().subscribe(users => {
  // Loader hidden after request completes
  this.users = users;
});
```

---

## Models & Interfaces

**File**: `src/app/core/models/index.ts`

### User Interface

```typescript
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
```

### ApiResponse Interface

```typescript
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}
```

### TableState Interface

```typescript
export interface TableState {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
```

### DashboardStat Interface

```typescript
export interface DashboardStat {
  label: string;
  value: number | string;
  icon: string;
  trend?: number;
  color: string;
}
```

### ChartData Interface

```typescript
export interface ChartData {
  name: string;
  value: number;
}
```

---

## Usage Examples

### Example 1: Complete User CRUD Operations

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  template: `
    <div>
      <button (click)="createUser()">Create</button>
      <button (click)="readUser()">Read</button>
      <button (click)="updateUser()">Update</button>
      <button (click)="deleteUser()">Delete</button>
    </div>
  `
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  // CREATE
  createUser(): void {
    const user: Partial<User> = {
      name: 'New User',
      email: 'user@example.com',
      username: 'newuser'
    };

    this.apiService.createUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        created => console.log('Created:', created),
        error => console.error('Error:', error)
      );
  }

  // READ
  readUser(): void {
    this.apiService.getUserById(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        user => console.log('User:', user),
        error => console.error('Error:', error)
      );
  }

  // UPDATE
  updateUser(): void {
    this.apiService.updateUser(1, { name: 'Updated Name' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        updated => console.log('Updated:', updated),
        error => console.error('Error:', error)
      );
  }

  // DELETE
  deleteUser(): void {
    this.apiService.deleteUser(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => console.log('Deleted successfully'),
        error => console.error('Error:', error)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Example 2: Using Multiple Services Together

```typescript
@Component({
  selector: 'app-dashboard'
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isDarkMode$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.monitorLoadingState();
  }

  private loadUsers(): void {
    this.apiService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        users => {
          this.users = users;
        },
        error => {
          console.error('Failed to load users:', error);
        }
      );
  }

  private monitorLoadingState(): void {
    this.loaderService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        console.log('Loading:', isLoading);
      });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Example 3: Error Handling

```typescript
export class ErrorHandlingComponent {
  constructor(private apiService: ApiService) {}

  fetchDataWithErrorHandling(): void {
    this.apiService.getUsers().subscribe(
      // Success handler
      (users: User[]) => {
        console.log('Users loaded:', users);
      },
      // Error handler
      (error) => {
        if (error.status === 404) {
          console.error('Resource not found');
        } else if (error.status === 401) {
          console.error('Unauthorized. Please login.');
        } else if (error.status === 500) {
          console.error('Server error');
        } else {
          console.error('Unknown error:', error);
        }
      },
      // Complete handler
      () => {
        console.log('Request completed');
      }
    );
  }
}
```

### Example 4: Combining Multiple API Calls

```typescript
import { combineLatest } from 'rxjs';

export class CombinedDataComponent implements OnInit {
  users: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    combineLatest([
      this.apiService.getUsers(),
      this.apiService.get<any>('/posts')
    ]).subscribe(
      ([users, posts]) => {
        this.users = users;
        console.log('Both requests completed');
      },
      error => console.error('Error:', error)
    );
  }
}
```

### Example 5: Sequential API Calls

```typescript
import { switchMap } from 'rxjs/operators';

export class SequentialComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // First get user, then get their posts
    this.apiService.getUserById(1)
      .pipe(
        switchMap(user => {
          console.log('Got user:', user.name);
          return this.apiService.get(`/posts?userId=${user.id}`);
        })
      )
      .subscribe(
        posts => console.log('Got posts:', posts),
        error => console.error('Error:', error)
      );
  }
}
```

---

## Environment Configuration

**File**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://jsonplaceholder.typicode.com'
};
```

Change `apiBaseUrl` to point to different environments:

```typescript
// Development
apiBaseUrl: 'http://localhost:3000'

// Staging
apiBaseUrl: 'https://api-staging.example.com'

// Production
apiBaseUrl: 'https://api.example.com'
```

---

## Best Practices

1. ✅ **Always unsubscribe** - Use `takeUntil` with `destroy$` subject
2. ✅ **Handle errors** - Provide error handler in subscribe
3. ✅ **Use typing** - Always specify Observable type
4. ✅ **Lazy load** - Use `switchMap` for sequential requests
5. ✅ **Combine requests** - Use `combineLatest` for parallel requests
6. ✅ **Check interceptor** - Loader shows automatically for API calls
7. ✅ **Store theme** - Theme persists in localStorage
8. ✅ **Strong typing** - All services return typed observables

---

## Troubleshooting

### Q: Why is the loader not showing?
**A:** Check if URL is in `exemptUrls` in `http-loader.interceptor.ts`

### Q: API calls not working?
**A:** 
- Verify `apiBaseUrl` in `environment.ts`
- Check API response format matches interface
- Verify CORS is enabled on backend

### Q: Theme not persisting?
**A:** Check localStorage in DevTools. Theme should be stored as 'dark' or 'light'

### Q: Memory leaks warning?
**A:** Ensure all subscriptions use `takeUntil(this.destroy$)` pattern

---

**For more information, see:**
- [README.md](README.md) - Project overview
- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture and patterns

Happy Coding! 🚀
