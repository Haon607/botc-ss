import { Injectable } from '@angular/core';
import { Store } from './store';
import { Script } from '../models/script';

@Injectable({
    providedIn: 'root',
})
export class Memory {
    scripts = new ScriptStore();
}

class ScriptStore extends Store<Script[]> {
    constructor() {
        super('scripts');
    }

    public override get(): Script[] {
        return this.toObjects(super.get() ?? []);
    }

    private toObjects(scripts: Script[]): Script[] {
        return scripts.map((script) => Script.deserialize(script));
    }
}
