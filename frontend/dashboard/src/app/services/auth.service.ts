import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { IToken } from '../interface/token.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiToken: string;
  private username: string;
  private iap: number;
  private exp: number;
  private timestamp: Date;

  constructor(private http: HttpClient, private route: Router) {
    this.apiToken = localStorage.getItem('apiToken') || '';
    this.handleJWTDecode();
    setInterval(() => {
      this.autoRenew();
    }, 1000)
  }

  login(user: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/bearer`, { user, password }).pipe(map(apiToken => {
      this.setApiToken(apiToken.access_token);
    }))
  }

  autoRenew() {
    if (!this.apiToken) {
      return;
    }
    const expDate = new Date(this.exp * 1000);
    const currDate = new Date();

    const timeout = expDate.getTime() - currDate.getTime() - 60000;
    if (timeout < 0) {
      this.renew();
    }

  }

  async renew() {
    const apiToken = await this.getAsync<any>(`${environment.apiUrl}/api/auth/renew`);
    this.setApiToken(apiToken.access_token);
  }

  logout() {
    localStorage.removeItem('apiToken');
    this.apiToken = '';
    this.route.navigate(['login'])
  }

  public getApiToken(): string {
    return this.apiToken;
  }

  public getUserName(): string {
    return this.username;
  }

  private setApiToken(apiToken: string) {
    this.apiToken = apiToken;
    localStorage.setItem('apiToken', apiToken);
    this.handleJWTDecode();
  }

  private getAsync<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(url).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      })
    })
  }

  private handleJWTDecode() {
    if(!this.apiToken) return;

    const token: IToken = jwt_decode(this.apiToken);
    this.username = token.username;
    this.timestamp = token.timestamp;
    this.exp = token.exp;
    this.iap = token.iat
  }

}
