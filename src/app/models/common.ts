import { Script } from './script';
import { Character } from './character';
import { Metadata } from './metadata';

export interface Verifiable {
    verify(): Errors;
}

export class Errors {
    constructor(public messages: Message[] = []) {}

    public get highestLevel(): Severity {
        return Math.max(...this.messages.map((message) => message.severity), Severity.NONE);
    }

    public get errors() {
        return this.messages.filter((message) => message.severity === Severity.ERROR);
    }

    public get warnings() {
        return this.messages.filter((message) => message.severity === Severity.WARN);
    }

    public get infos() {
        return this.messages.filter((message) => message.severity === Severity.INFO);
    }

    public valid(): boolean {
        return this.errors.length === 0;
    }

    public combine(error: Errors) {
        error.messages.forEach((message) => this.messages.push());
    }

    public combineChild(parent: Verifiable, error: Errors) {
        error.messages = error.messages.map((message) => {
            message.causedBy.reverse();
            message.causedBy.push(parent);
            message.causedBy.reverse();
            return message;
        });
        this.combine(error);
    }
}

export enum Severity {
    ERROR = 3,
    WARN = 2,
    INFO = 1,
    NONE = 0,
}

export class Message {
    public causedBy: Verifiable[];

    public constructor(
        public content: string,
        public severity: Severity,
        ...causedBy: Verifiable[]
    ) {
        this.causedBy = causedBy;
    }

    public get causedByChain(): string {
        return this.causedBy
            .map((obj) => {
                if (obj instanceof Script) return 'Script[' + obj.metadata.name + ' by ' + obj.metadata.author + ']';
                if (obj instanceof Character) return 'Character[' + obj.id + ']';
                if (obj instanceof Metadata) return 'Metadata';
                return JSON.stringify(obj);
            })
            .join(' -> ');
    }
}
