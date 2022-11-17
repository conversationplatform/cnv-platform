import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const apiToken = this.authService.getApiToken();
        if (apiToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${apiToken}`
                }
            });
        }

        return next.handle(request);
    }
}
