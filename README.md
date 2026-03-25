# Angular 20 Dashboard Pro - Professional Sample Project

A modern, production-ready Angular 20 Dashboard application built with **Standalone Components**, **Angular Material**, and best practices. This project serves as a comprehensive reference for building scalable Angular applications.

## 🎯 Features

✅ **Angular 20 Standalone Architecture** - No NgModules, modern composition  
✅ **Lazy Loading** - Efficient code splitting with `loadComponent`  
✅ **Responsive Layout** - Dashboard layout with header and sidebar navigation  
✅ **Angular Material Integration** - Modern UI components and theming  
✅ **Dark Mode Support** - Toggle dark/light theme with persistence  
✅ **HTTP Interceptor** - Global loader showing during API requests  
✅ **API Service** - Reusable service wrapper for HTTP calls  
✅ **Reactive Forms** - Form validation with reactive approach  
✅ **Data Table** - Material table with sorting and pagination  
✅ **Charts** - ECharts integration for data visualization  
✅ **Error Handling** - Comprehensive error management  
✅ **Strong Typing** - Full TypeScript strict mode support  
✅ **Signals** - Modern Angular signals for state management  

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── layouts/
│   │   │   └── layout.component.ts       # Main layout with header & sidebar
│   │   ├── services/
│   │   │   ├── api.service.ts            # Generic HTTP API service
│   │   │   ├── loader.service.ts         # Global loader state
│   │   │   └── theme.service.ts          # Dark mode management
│   │   ├── interceptors/
│   │   │   └── http-loader.interceptor.ts # HTTP loader interceptor
│   │   └── models/
│   │       └── index.ts                  # TypeScript interfaces
│   ├── shared/
│   │   └── components/
│   │       ├── loader.component.ts       # Global spinner
│   │       ├── header.component.ts       # Top toolbar
│   │       ├── sidebar.component.ts      # Navigation sidebar
│   │       └── stat-card.component.ts    # Reusable stat card
│   ├── pages/
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts    # Dashboard with stats & charts
│   │   ├── users/
│   │   │   └── users.component.ts        # Users table with pagination
│   │   └── add-user/
│   │       └── add-user.component.ts     # User registration form
│   ├── app.component.ts                  # Root component
│   └── app.routes.ts                     # Routing configuration
├── environments/
│   ├── environment.ts                    # Development config
│   └── environment.prod.ts               # Production config
├── assets/                               # Static assets
│   └── styles/                           # Global styles
├── main.ts                               # Application entry point
├── index.html                            # HTML template
├── styles.scss                           # Global SCSS
└── favicon.ico                           # App icon

└── Configuration Files
    ├── package.json                      # Dependencies
    ├── tsconfig.json                     # TypeScript config
    ├── tsconfig.app.json                 # App-specific TS config
    ├── tsconfig.spec.json                # Test TS config
    ├── angular.json                      # Angular CLI config
    └── .gitignore                        # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (Install from [nodejs.org](https://nodejs.org))
- **npm** 10+ or **yarn**
- **Visual Studio Code** (optional but recommended)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd "c:\Projects\First Test Angular\First-Angular"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200/`

## 📦 Available Scripts

```bash
# Development server with live reload
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode for development
npm run watch

# Lint code
npm run lint
```

## 🔑 Key Components

### Dashboard Page
- **Statistics Cards** - Shows total users, revenue, and orders with trend indicators
- **Pie Chart** - Users distribution by region (ECharts)
- **Bar Chart** - Monthly revenue trends
- **Responsive Grid** - Adapts to different screen sizes

### Users Page
- **Material Data Table** - Displays users from JSONPlaceholder API
- **Sorting** - Click column headers to sort
- **Pagination** - Navigate through users (5, 10, 25, 50 per page)
- **Actions** - View and delete user functionality
- **Dynamic Loading** - Real API calls with loader

### Add User Page
- **Reactive Form** - Built with `FormBuilder` and `FormGroup`
- **Validation** - Email format, required fields, min length
- **Error Messages** - Real-time validation feedback
- **Success Notification** - Snackbar on successful submission
- **Form Reset** - Clear form after submission

## 🎨 Theming

### Dark Mode Implementation

The application includes a complete dark mode solution:

```typescript
// Toggle dark mode
this.themeService.toggleDarkMode();

// Subscribe to theme changes
this.themeService.darkMode$.subscribe(isDark => {
  // React to theme change
});

// Using Signals
const isDarkMode = this.themeService.isDarkMode;
```

### Components Styling

All components use CSS custom properties and dark theme support:

```scss
:host-context(.dark-theme) .component-class {
  background-color: #2a2a2a;
  color: #e0e0e0;
}
```

## 🔌 Services

### ApiService
Generic HTTP service wrapper for all API calls:

```typescript
// GET request
this.apiService.get<User[]>('/users').subscribe(users => {
  console.log(users);
});

// POST request
this.apiService.post<User>('/users', userData).subscribe(user => {
  console.log(user);
});

// Pre-built methods
this.apiService.getUsers();
this.apiService.createUser(data);
this.apiService.deleteUser(id);
```

### LoaderService
Global loader state management:

```typescript
// Show loader
this.loaderService.show();

// Subscribe to loading state
this.loaderService.loading$.subscribe(isLoading => {
  console.log(isLoading);
});
```

### ThemeService
Dark mode management with persistence:

```typescript
// Toggle theme
this.themeService.toggleDarkMode();

// Get current theme
const isDark = this.themeService.isDarkModeActive();

// Using Signal
const isDark = this.themeService.isDarkMode();
```

## 🌐 HTTP Interceptor

The `HttpLoaderInterceptor` automatically shows a loader during API requests:

```typescript
// Automatically triggers on any HTTP request
// Tracks multiple concurrent requests
// Shows/hides loader based on all requests completion
```

To exempt specific URLs from showing the loader:

```typescript
private isExemptFromLoader(url: string): boolean {
  const exemptUrls = ['/health-check'];
  return exemptUrls.some(exemptUrl => url.includes(exemptUrl));
}
```

## 🔒 Type Safety

All components use strict TypeScript with full type support:

```typescript
// Strongly typed interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  // ... more properties
}

// Strictly typed forms
userForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]]
});
```

## 📱 Responsive Design

The application is fully responsive:

- **Desktop** (1024px+) - Full layout with sidebar
- **Tablet** (768px - 1024px) - Collapsible sidebar
- **Mobile** (< 768px) - Full-width content, hidden sidebar

```scss
@media (max-width: 768px) {
  // Mobile-specific styles
}
```

## 🛠️ Configuration

### Environment Variables

Update API endpoints in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://jsonplaceholder.typicode.com'
};
```

### Path Aliases

TypeScript path aliases are configured for cleaner imports:

```typescript
// Instead of: import { ApiService } from '../../../services/api.service';
// Use: import { ApiService } from '@core/services/api.service';

import { User } from '@core/models';
import { ApiService } from '@core/services/api.service';
```

## 📚 Technologies

- **Angular 20** - Frontend framework
- **TypeScript 5.4** - Type-safe JavaScript
- **Angular Material** - UI components
- **RxJS 7.8** - Reactive programming
- **ECharts 5.4** - Data visualization
- **Reactive Forms** - Form handling

## ✨ Best Practices Implemented

1. ✅ **Standalone Components** - Modern Angular architecture without NgModules
2. ✅ **Lazy Loading** - Components loaded on demand with `loadComponent`
3. ✅ **Strong Typing** - Full TypeScript strict mode compliance
4. ✅ **Separation of Concerns** - Core, shared, and pages layer structure
5. ✅ **Memory Management** - Proper unsubscribe with `takeUntil` and `destroy$`
6. ✅ **HTTP Interceptors** - Centralized request/response handling
7. ✅ **Reactive Forms** - Type-safe form handling
8. ✅ **Error Handling** - Try-catch, error subscriptions, user feedback
9. ✅ **Performance** - Change detection optimization, lazy loading
10. ✅ **Accessibility** - Material components with ARIA support

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Material icons not showing
Ensure the Material Icons font is loaded in `index.html`:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### API calls not working
1. Check API base URL in `environment.ts`
2. Verify CORS is enabled on the API server
3. Check Network tab in DevTools for actual errors

## 📖 Learning Resources

- [Angular Official Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [ECharts Documentation](https://echarts.apache.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Created as a professional reference implementation for Angular 20 applications.

---

**Happy Coding! 🚀**

For questions or improvements, feel free to contribute or open an issue.
