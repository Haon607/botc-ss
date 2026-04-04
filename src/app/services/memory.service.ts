import { Injectable } from '@angular/core';
import { Store } from './store';
import { Script } from '../models/script';
import { CharacterDetailsService } from './character-details.service';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Memory {
    scripts: ScriptStore;

    constructor(private readonly cDS: CharacterDetailsService) {
        this.scripts = new ScriptStore(this.cDS);
    }
}

class ScriptStore extends Store<Script[]> {
    constructor(private readonly cDS: CharacterDetailsService) {
        super('scripts');
    }

    public get changes(): Observable<Script[]> {
        return this.changeSubject.pipe(map((x) => this.toObjects(x ?? [])));
    }

    public override set(toSet: Script[]) {
        const scripts = toSet.map((script) => script.stripped());
        return super.set(scripts);
    }

    public override get(): Script[] {
        return this.toObjects(super.get() ?? []);
    }

    public toObjects(scripts: any[]): Script[] {
        return scripts.map((script) => Script.deserialize(script, this.cDS));
    }
}
