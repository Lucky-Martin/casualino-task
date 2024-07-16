import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

export interface ISignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private initialAuthCheck = false;
  private readonly apiUrl: string = 'http://localhost:8000/api';

  constructor(private httpClient: HttpClient, private router: Router) { }

  get isLoggedIn(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private async storeToken(token: string) {
    if (!token) return;
    localStorage.setItem('auth_token', token);
  }

  private async removeToken() {
    localStorage.removeItem('auth_token');
  }

  private async getToken(): Promise<string | null> {
    return localStorage.getItem('auth_token');
  }

  async checkInitialLoginStatus() {
    if (this.initialAuthCheck) return;
    this.initialAuthCheck = true;

    this.httpClient.get<{
      token: string,
      user: any
    }>(`${this.apiUrl}/auth/status`, {withCredentials: true}).subscribe(
      async res => {
        await this.processSuccessAuth(res);
      },
      async err => {
        console.error("Initial auth status", err);
        this.authStatus.next(false);
      }
    );
  }

  signup(credentials: ISignupCredentials) {
    return this.httpClient.post<{ token: string, user: any }>(`${this.apiUrl}/auth/signup`, {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    });
  }

  login(credentials: ILoginCredentials) {
    return this.httpClient.post<{ token: string, user: any }>(`${this.apiUrl}/auth/login`, credentials);
  }

  async processSuccessAuth(res: any) {
    await this.storeToken(res.token);
    this.authStatus.next(true);
    if (typeof res.user === 'string') {
      res.user = JSON.parse(res.user);
    }

    localStorage.setItem('user-json', JSON.stringify(res.user));
    await this.router.navigateByUrl('home', {replaceUrl: true});
  }

  isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
