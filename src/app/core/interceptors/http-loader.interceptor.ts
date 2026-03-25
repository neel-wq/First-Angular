import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private completedRequests = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Don't show loader for certain endpoints if needed
    const shouldShowLoader = !this.isExemptFromLoader(request.url);

    if (shouldShowLoader) {
      this.totalRequests++;
      this.loaderService.show();
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        if (shouldShowLoader) {
          this.completedRequests++;
          if (this.completedRequests >= this.totalRequests) {
            this.loaderService.hide();
            this.resetCounters();
          }
        }
        return throwError(() => error);
      }),
      finalize(() => {
        if (shouldShowLoader) {
          this.completedRequests++;
          if (this.completedRequests >= this.totalRequests) {
            this.loaderService.hide();
            this.resetCounters();
          }
        }
      })
    );
  }

  private isExemptFromLoader(url: string): boolean {
    // Add URLs that should not trigger loader
    const exemptUrls: string[] = [
      // Add any exempted URLs here
    ];
    return exemptUrls.some(exemptUrl => url.includes(exemptUrl));
  }

  private resetCounters(): void {
    this.totalRequests = 0;
    this.completedRequests = 0;
  }
}
