import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'https://localhost:7023/api/Auth';

    login(credentials: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, credentials)
                        .pipe(
                            tap((response) => {
                                localStorage.setItem('token', response.token);
                            })
                        );
    };

    register(user: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, user)
                        .pipe(
                            tap((response) => {
                                localStorage.setItem('token', response.token);
                            })
                        );;
    };

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    };
}
