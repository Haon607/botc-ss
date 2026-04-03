import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {shareReplay, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ResourceHttpService {
    private readonly cache = new Map<string, any>();
    private readonly inFlightRequests = new Map<string, Observable<any>>();

    constructor(private readonly http: HttpClient) {
    }

    get<T>(url: string): Observable<T> {
        if (this.cache.has(url)) {
            return of(this.cache.get(url));
        }

        if (this.inFlightRequests.has(url)) {
            return this.inFlightRequests.get(url)!;
        }

        const request$ = this.http.get<T>(url).pipe(
            tap(data => {
                this.cache.set(url, data);
                this.inFlightRequests.delete(url);
            }),
            shareReplay(1)
        );

        this.inFlightRequests.set(url, request$);

        return request$;
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
