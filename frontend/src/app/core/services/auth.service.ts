import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ApiService } from "./api.service";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author";
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly tokenKey = "ptmaja_token";
  private readonly userKey = "ptmaja_user";
  private userSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromStorage());

  readonly user$ = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {}

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api.baseUrl}/auth/register`, payload)
      .pipe(tap((res: AuthResponse) => this.persistAuth(res)));
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api.baseUrl}/auth/login`, payload)
      .pipe(tap((res: AuthResponse) => this.persistAuth(res)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  private persistAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.userSubject.next(response.user);
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
