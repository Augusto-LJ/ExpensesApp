import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'https://localhost:7023/api/Auth';
    private currentUserSubject = new BehaviorSubject<string | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        const token = localStorage.getItem('token');
        if (token) {
            this.currentUserSubject.next('user');
        }
    }


    login(credentials: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, credentials)
                        .pipe(
                            tap((response) => {
                                localStorage.setItem('token', response.token);
                                this.currentUserSubject.next('user');
                            })
                        );
    };

    register(user: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, user)
                        .pipe(
                            tap((response) => {
                                localStorage.setItem('token', response.token);
                                this.currentUserSubject.next('user');
                            })
                        );;
    };

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    };
    
    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    getToken() : string | null {
        return localStorage.getItem('token');
    }
}
