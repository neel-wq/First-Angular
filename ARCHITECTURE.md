# Angular 20 Dashboard - Architecture & Code Patterns Guide

## 🏗️ Architecture Overview

This project follows **modern Angular 20 best practices** with a clean, scalable architecture.

### Folder Structure Rationale

```
src/app/
├── core/           → Singleton services, layouts, interceptors
├── shared/         → Reusable components, pipes, directives
└── pages/          → Page components (each page is a feature)
```

**Why this structure?**
- **core**: Contains app-wide services (initialized once via dependency injection)
- **shared**: Contains components used across multiple pages
- **pages**: Keeps page logic isolated and easier to maintain

## 📐 Component Patterns

### Standalone Components

All components in this project use **Angular's Standalone API**:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,           // ← Key: Standalone
  imports: [CommonModule],    // ← Explicit imports
  template: `...`,
  styles: [`...`]
})
export class ExampleComponent {
  // No NgModule needed!
}
```

**Benefits:**
- No NgModule boilerplate
- Tree-shakeable
- Easier lazy loading
- Better code splitting

### Service Patterns

#### 1. Observable-based Service (Recommended)
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadData(): void {
    this.http.get<Data[]>('/api/data').subscribe(
      data => this.dataSubject.next(data)
    );
  }
}

// Usage in component
constructor(private dataService: DataService) {}
ngOnInit() { 
  this.data$ = this.dataService.data$;
  this.dataService.loadData();
}
```

#### 2. Signal-based Service (Modern Angular)
```typescript
@Injectable({ providedIn: 'root' })
export class SignalService {
  public data = signal<Data[]>([]);
  
  loadData(): void {
    this.http.get<Data[]>('/api/data').subscribe(
      data => this.data.set(data)
    );
  }
}

// Usage in component
public data = inject(SignalService).data;
```

### Component Lifecycle Patterns

#### Memory-Safe Subscription Pattern
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private service: MyService) {}

  ngOnInit(): void {
    // Pattern: Use takeUntil with destroy$ subject
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.processData(data);
      });
  }

  ngOnDestroy(): void {
    // AutoUnsubscribe all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Why this pattern?**
- Automatic unsubscribe on component destroy
- Prevents memory leaks
- No manual subscription tracking needed
- Cleaner than unsubscribe array pattern

### Form Patterns

#### Reactive Forms with Strong Typing
```typescript
export class FormComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: MyService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: [null, [Validators.required, Validators.min(18)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data: MyData = {
      email: this.form.get('email')?.value,
      name: this.form.get('name')?.value,
      age: this.form.get('age')?.value
    };

    this.service.submit(data).subscribe(
      () => this.handleSuccess(),
      error => this.handleError(error)
    );
  }

  resetForm(): void {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }
}
```

**Template:**
```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput formControlName="email" type="email">
    <mat-error *ngIf="form.get('email')?.hasError('required')">
      Email is required
    </mat-error>
    <mat-error *ngIf="form.get('email')?.hasError('email')">
      Invalid email format
    </mat-error>
  </mat-form-field>

  <button mat-raised-button [disabled]="form.invalid">Submit</button>
</form>
```

### HTTP Service Pattern

#### Generic, Reusable API Service
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiBaseUrl;

  // Generic methods
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  // Domain-specific methods
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.post<User>('/users', user);
  }
}

// Usage
this.api.getUsers().subscribe(users => {
  this.users = users;
});
```

### Data Table Pattern

```typescript
export class TableComponent implements OnInit {
  dataSource!: MatTableDataSource<Item>;
  displayedColumns = ['id', 'name', 'email', 'actions'];
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: MyService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.service.getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => this.dataSource.data = data,
        error => console.error(error)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Template:**
```html
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let element">{{ element.name }}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<mat-paginator 
  [length]="dataSource.data.length"
  [pageSize]="10"
  [pageSizeOptions]="[5, 10, 25]">
</mat-paginator>
```

## 🎨 Styling Patterns

### Dark Theme Implementation

**Component Styling:**
```typescript
@Component({
  selector: 'app-card',
  template: `<div class="card">Content</div>`,
  styles: [`
    .card {
      background: white;
      color: black;
    }

    :host-context(.dark-theme) .card {
      background: #2a2a2a;
      color: #e0e0e0;
    }
  `]
})
export class CardComponent {}
```

**Global Styles (styles.scss):**
```scss
:root {
  --primary: #667eea;
  --background: white;
}

:host-context(.dark-theme) {
  --primary: #667eea;
  --background: #1a1a1a;
}

body {
  background: var(--background);
}
```

**Theme Service:**
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode(): void {
    const isDark = !this.darkModeSubject.value;
    this.darkModeSubject.next(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
```

## 🔒 Type Safety Patterns

### Interface Hierarchy
```typescript
// Base interfaces
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Domain models
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Usage
this.api.get<ApiResponse<User>>('/users/1').subscribe(response => {
  if (response.success) {
    const user: User = response.data;
  }
});
```

### Strict Typing
```typescript
// Enable strict mode in tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}

// Always type parameters
function processUser(user: User): void {
  // user type is strictly enforced
  console.log(user.email); // ✅ OK
  console.log(user.xyz);   // ❌ Error: Property 'xyz' does not exist
}
```

## 🔌 Interceptor Patterns

### HTTP Loader Interceptor
```typescript
@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(private loader: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestCount++;
    this.loader.show();

    return next.handle(request).pipe(
      finalize(() => {
        this.requestCount--;
        if (this.requestCount === 0) {
          this.loader.hide();
        }
      }),
      catchError(error => {
        console.error('HTTP Error:', error);
        this.loader.hide();
        return throwError(() => error);
      })
    );
  }
}

// Register in main.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLoaderInterceptor,
    multi: true
  }
]
```

### Custom Header Interceptor
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.auth.getToken();
    
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request);
  }
}
```

## 🧪 Testing Patterns

### Service Testing
```typescript
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [{ id: 1, name: 'Test' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### Component Testing
```typescript
describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableComponent],
      providers: [
        {
          provide: UserService,
          useValue: { getUsers: () => of([]) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display user table', () => {
    const table = fixture.debugElement.query(By.directive(MatTable));
    expect(table).toBeTruthy();
  });
});
```

## 🚀 Performance Patterns

### Change Detection OnPush
```typescript
@Component({
  selector: 'app-card',
  template: `<div>{{ item.name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() item!: Item;
}
```

### Lazy Loading Images
```typescript
<img [src]="imageUrl" loading="lazy" alt="description">
```

### Unsubscribe Pattern
Already shown above with `takeUntil` operator

## 📚 Code Organization Checklist

- [ ] Components are standalone
- [ ] All subscriptions use `takeUntil`
- [ ] Interfaces in separate `models` file
- [ ] Services injected with `providedIn: 'root'`
- [ ] Error handling in subscribe
- [ ] Type safety enabled in tsconfig
- [ ] Forms use Reactive Forms
- [ ] Interceptors registered in main.ts
- [ ] Dark theme supported
- [ ] Path aliases used instead of relative paths

---

**This architecture pattern ensures:**
✅ Scalability  
✅ Maintainability  
✅ Testability  
✅ Performance  
✅ Type Safety  
✅ Code Reusability  

Happy Coding! 🚀
