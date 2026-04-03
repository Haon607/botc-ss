import { Injectable } from '@angular/core';
import { ResourceHttpService } from './resource-http.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Botc {
    constructor(private readonly http: ResourceHttpService) {}

    public schema(): Observable<string> {
        return this.http.get<string>('https://release.botc.app/script-schema.json');
    }
}
