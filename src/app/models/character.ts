import { Errors, Message, Severity, Verifiable } from './common';

export class Character implements Verifiable {
    constructor(
        public id: string,
        public name: string,
        public image: string | undefined,
        public team: Team,
        public edition: 'carousel' | 'tb' | 'bmr' | 'generic' | 'loric' | 'fabled' | 'snv' | undefined,
        public ability: string,
        public flavour: string | undefined,
        public firstNight: number,
        public firstNightReminder: string | undefined,
        public otherNight: number,
        public otherNightReminder: string | undefined,
        public reminders: string[],
        public remindersGlobal: string[] | undefined,
        public setup: boolean,
    ) {}

    static deserialize(json: Character): Character {
        return new Character(
            json.id,
            json.name,
            json.image,
            json.team,
            json.edition,
            json.ability,
            json.flavour,
            json.firstNight,
            json.firstNightReminder,
            json.otherNight,
            json.otherNightReminder,
            json.reminders,
            json.remindersGlobal,
            json.setup,
        );
    }

    verify(): Errors {
        const err = new Errors();

        console.log(this);

        if (this.id.trim() === '') err.messages.push(new Message('Field id empty', Severity.ERROR, this));
        if (this.name.trim() === '') err.messages.push(new Message('Field name empty', Severity.ERROR, this));
        if (this.image?.trim() === '') err.messages.push(new Message('Field image empty', Severity.ERROR, this));
        if (this.ability.trim() === '') err.messages.push(new Message('Field ability empty', Severity.ERROR, this));
        if (this.flavour?.trim() === '') err.messages.push(new Message('Field flavour empty', Severity.WARN, this));
        if (this.reminders.some((reminder) => reminder.trim() === ''))
            err.messages.push(new Message('Field reminders contains an empty entry', Severity.WARN, this));
        if (this.remindersGlobal?.some((reminder) => reminder.trim() === ''))
            err.messages.push(new Message('Field remindersGlobal contains an empty entry', Severity.WARN, this));

        if (this.firstNight === 0 && this.firstNightReminder)
            err.messages.push(
                new Message('Field firstNightReminder is set, although field firstNight is 0', Severity.WARN, this),
            );
        if (this.otherNight === 0 && this.otherNightReminder)
            err.messages.push(
                new Message('Field otherNIghtReminder is set, although field otherNight is 0', Severity.WARN, this),
            );
        if (this.setup !== (this.ability.includes('[') && this.ability.includes(']')))
            err.messages.push(
                new Message('Field setup should be true, when ability includes setup brackets ([])', Severity.WARN, this),
            );
        if (
            this.team === Team.DEMON &&
            this.otherNight > 0 &&
            !this.reminders.some((reminder) => reminder.toLowerCase().includes('dead'))
        )
            err.messages.push(
                new Message(
                    'If this Character kills in the Night, consider adding a "DEAD" Reminder-Token to the Field reminders ',
                    Severity.INFO,
                    this,
                ),
            );

        return err;
    }
}

export enum Team {
    TOWNSFOLK = 'townsfolk',
    OUTSIDER = 'outsider',
    MINION = 'minion',
    DEMON = 'demon',
    TRAVELER = 'traveler',
    FABLED = 'fabled',
    LORIC = 'loric',
}

export interface DetailedCharacter {
    details: Character;
    originalElement: Character | string;
}
