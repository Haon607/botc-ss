import { Injectable } from '@angular/core';
import { ResourceHttpService } from './resource-http.service';

@Injectable({
    providedIn: 'root',
})
export class Botc {
    constructor(private readonly http: ResourceHttpService) {}

    public schema(): Promise<string> {
        return this.http.get<string>('https://release.botc.app/script-schema.json');
    }

    public roles(): Promise<string> {
        return this.http.get<string>('https://release.botc.app/resources/data/roles.json');
    }
}
