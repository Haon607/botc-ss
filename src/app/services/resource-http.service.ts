import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ResourceHttpService {
    private readonly cache = new Map<string, any>();
    private readonly inFlightRequests = new Map<string, Promise<any>>();

    constructor(private readonly http: HttpClient) {}

    async get<T>(url: string): Promise<T> {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.inFlightRequests.has(url)) {
            return this.inFlightRequests.get(url)!;
        }

        const request$ = this.http.get<T>(url).pipe(
            tap((data) => {
                this.cache.set(url, data);
                this.inFlightRequests.delete(url);
            }),
            shareReplay(1),
        );

        const promise = firstValueFrom(request$).catch((error) => {
            this.inFlightRequests.delete(url);
            throw error;
        });

        this.inFlightRequests.set(url, promise);

        return promise;
    }

    clear(url: string): void {
        this.cache.delete(url);
        this.inFlightRequests.delete(url);
    }

    clearAll(): void {
        this.cache.clear();
        this.inFlightRequests.clear();
    }
}
