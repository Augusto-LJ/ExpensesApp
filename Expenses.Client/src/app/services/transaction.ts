import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Service()
export class Transaction {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7023/api';

    getAll() : Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/Transactions`);
    }

    getById(id: number) : Observable<Transaction> {
        return this.http.get<Transaction>(`${this.apiUrl}/Transactions/${id}`);
    }

    create(transaction: Transaction) : Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/Transactions`, transaction);
    }

    update(id: number, transaction: Transaction) : Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/Transactions/${id}`, transaction);
    }
    
    delete(id: number) : Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Transactions/${id}`);
    }
}
