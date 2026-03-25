# Angular 20 Dashboard - Commands Reference

## 🚀 Development Commands

### Install & Setup
```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name --save

# Install dev dependency
npm install package-name --save-dev
```

### Development Server
```bash
# Start development server (opens browser automatically)
npm start

# Start on specific port
ng serve --port 4300

# Build on save (watch mode)
npm run watch
```

### Building
```bash
# Development build
ng build

# Production build (optimized)
npm run build:prod

# Build with source maps
ng build --source-map

# Build output to specific directory
ng build --output-path ./dist/my-app
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in headless mode
ng test --watch=false

# Run tests with code coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/users.component.spec.ts'
```

### Linting & Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues automatically
ng lint --fix
```

## 📁 Project Structure Commands

### Generate New Component
```bash
# Generate standalone component (recommended)
ng generate component --standalone pages/my-page

# Generate component with routing
ng generate component --standalone --routing pages/my-page

# Shorthand
ng g c --standalone pages/my-page
```

### Generate New Service
```bash
# Generate service
ng g s core/services/my-service

# Service will be created with providedIn: 'root'
```

### Generate Module (Legacy - Not Recommended)
```bash
# Do NOT use NgModules in this project
# Use standalone components instead
```

## 🔧 Configuration Commands

### Environment
```bash
# Development environment
ng serve          # Uses environment.ts

# Production environment
ng build --configuration production  # Uses environment.prod.ts
```

### Update Angular
```bash
# Check for updates
ng update @angular/core @angular/cli

# Update to specific version
ng update @angular/core@20
```

## 📦 NPM Package Commands

### Project Dependencies
```bash
# Update all packages
npm update

# Check for outdated packages
npm outdated

# Install exact versions from package.json
npm ci (clean install)

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clean cache
npm cache clean --force
```

## 🐛 Debugging Commands

### Debug in Browser DevTools
```bash
# Development build includes source maps by default
npm start

# Open DevTools: F12 or Ctrl+Shift+I
# Go to Sources tab to debug
# Set breakpoints and step through code
```

### Debug with VS Code
```bash
# Install VS Code Angular debug extension
# Create .vscode/launch.json:

{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceRoot}/src",
      "sourceMapPathOverride": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}

# Then press F5 to start debugging
```

### View Console Output
```bash
# In browser console (F12)
console.log('Debug info');
console.error('Error message');
console.warn('Warning message');

# View network requests
# DevTools > Network tab
```

## 🌐 Working with API

### Test API Endpoints
```bash
# Using curl (if installed)
curl https://jsonplaceholder.typicode.com/users

# Using VS Code REST Client extension
GET https://jsonplaceholder.typicode.com/users

# Using Postman
# Create new request
# Enter URL, select GET, click Send
```

### Mock API Responses
```typescript
// In service, use mock data for testing
if (environment.production === false) {
  return of(mockUsers);  // Return mock data
}
```

## 📚 Documentation Generation

### Generate Type Documentation
```bash
# Using TypeDoc (install first)
npm install --save-dev typedoc

# Generate documentation
npx typedoc --out docs src/app
```

## 🎯 Git Commands (Workflow)

```bash
# Initialize git (if not already)
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: add new feature"

# Create branch
git branch feature/my-feature
git checkout feature/my-feature

# Or in one command
git checkout -b feature/my-feature

# Push changes
git push origin feature/my-feature

# Create pull request (on GitHub/GitLab)
# Then merge to main branch
```

## 🚀 Deployment Commands

### Build for Production
```bash
# Production build
npm run build:prod

# Build output on: dist/angular-dashboard/
```

### Deploy to Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/angular-dashboard
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📊 Performance Analysis

### Build Analysis
```bash
# Build with stats
ng build --stats-json

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/angular-dashboard/stats.json
```

### Performance Monitoring
```typescript
// In main.ts
if (environment.production) {
  enableProdMode();
}

// Add performance monitoring
import { enableDebugTools } from '@angular/platform-browser';
const ref = platformBrowserDynamic().bootstrapModule(AppComponent);
enableDebugTools(ref.componentRef);
```

## 🔐 Security Commands

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Fix with force (may cause conflicts)
npm audit fix --force
```

## 📝 Common Workflows

### Daily Development Workflow
```bash
# 1. Update from repository
git pull origin main

# 2. Install new dependencies if any
npm install

# 3. Start development server
npm start

# 4. Make changes and test

# 5. Run tests
npm test

# 6. Lint code
npm run lint

# 7. Commit changes
git add .
git commit -m "feat: description"

# 8. Push changes
git push origin feature-branch
```

### Preparing for Production
```bash
# 1. Run all tests
npm test -- --watch=false

# 2. Run linter
npm run lint

# 3. Build for production
npm run build:prod

# 4. Test production build locally
npx http-server dist/angular-dashboard -c-1

# 5. Deploy
npm run deploy  # or your deployment script
```

## ⚙️ Useful npm Scripts (in package.json)

Current available scripts:

```bash
npm start              # Development server
npm run build          # Development build
npm run build:prod     # Production build  
npm run watch         # Watch mode
npm test              # Run tests
npm run lint          # Lint code
```

## 💡 Pro Tips

### Speed Up npm install
```bash
# Use npm ci instead of npm install in CI environments
npm ci

# Use --prefer-offline flag
npm install --prefer-offline

# Skip optional dependencies
npm install --no-optional
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear Angular cache
ng cache clean

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance
```bash
# Use npm ci for faster installs in CI
npm ci

# Use npm dedupe to reduce duplicate packages
npm dedupe

# Analyze your node_modules size
npm ls --all
```

## 🆘 Troubleshooting Commands

### Common Issues & Solutions

#### Port Already in Use
```bash
# Kill process on port 4200 (Windows)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Kill process on port 4200 (Mac/Linux)
lsof -ti:4200 | xargs kill -9

# Use different port
ng serve --port 4300
```

#### Clear Everything & Fresh Start
```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
npm install

# Mac/Linux
rm -rf node_modules package-lock.json
npm install
```

#### Reset to Original State
```bash
# Check git status
git status

# Undo all changes
git reset --hard

# Clean untracked files
git clean -fd
```

## 📱 Device Testing

### Test on Mobile
```bash
# Get your machine IP
ipconfig getifaddr en0  # Mac
ipconfig               # Windows

# Access from mobile (same network)
http://YOUR_IP:4200
```

### Test Different Browsers
```bash
# Chrome
ng serve    # Default

# Firefox
# Navigate to http://localhost:4200 in Firefox

# Safari Mac
# Navigate to http://localhost:4200 in Safari
```

## 🔄 Continuous Integration

### GitHub Actions
Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --watch=false
      - run: npm run build:prod
```

---

## 📖 Help & Documentation

```bash
# Angular CLI help
ng help

# Command specific help
ng serve --help
ng build --help
ng generate --help

# View version
ng version
npm --version
node --version
```

## ✨ Useful Tricks

### Quick Start Template
```bash
# Create a new Angular project from scratch
ng new my-app
cd my-app
npm start
```

### Update Angular Safely
```bash
# Always backup first
git commit -m "backup: before angular update"

# Update
ng update @angular/cli @angular/core

# Install new dependencies
npm install
```

---

**For more information, check the documentation files:**
- README.md
- QUICK_START.md
- ARCHITECTURE.md
- API_DOCUMENTATION.md

Happy Coding! 🚀
