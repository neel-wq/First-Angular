import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getStoredTheme());
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();
  
  // Using Signal for modern Angular approach
  public isDarkMode = signal<boolean>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.getStoredTheme());
  }

  toggleDarkMode(): void {
    const newMode = !this.darkModeSubject.value;
    this.darkModeSubject.next(newMode);
    this.isDarkMode.set(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  private getStoredTheme(): boolean {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : false;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  isDarkModeActive(): boolean {
    return this.darkModeSubject.value;
  }
}
