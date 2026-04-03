import { Subject } from 'rxjs';

export class Store<T> {
    public changeSubject: Subject<T | undefined>;

    constructor(private identifier: string) {
        this.changeSubject = new Subject<T | undefined>();
    }

    public set(toSet: T): T {
        localStorage[this.identifier] = JSON.stringify(toSet);
        this.changeSubject.next(toSet);
        return toSet;
    }

    public get(): T | undefined {
        try {
            return JSON.parse(localStorage[this.identifier]) as T;
        } catch (e) {
            return undefined;
        }
    }

    public remove() {
        localStorage.removeItem(this.identifier);
        this.changeSubject.next(undefined);
    }
}
