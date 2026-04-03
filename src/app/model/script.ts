import {Errors, Message, Severity, Verifiable} from './common';
import {Metadata} from './metadata';
import {Character, Team} from './character';
import {CharacterDetails} from '../dataset/character-details';

export class Script implements Verifiable {
    constructor(
        private readonly elements: (string | Character | Metadata)[],
        public type: ScriptType,
    ) {
    }

    public get metadata(): Metadata {
        const metadata = this.elements.find(element => element instanceof Metadata);
        if (metadata) return metadata;
        throw new Error(`No element instanceOf Metadata could be found in ${JSON.stringify(this.elements)}`)
    }

    public get characters(): Character[] {
        return this.elements
            .filter((element) => typeof element === 'string' || element instanceof Character)
            .map((element) => CharacterDetails.toCharacter(element));
    }

    static deserialize(json: string): Script {
        let answer: string | null;
        do {
            answer = prompt("(R)avenswood_Bluff or (T)eensyville?", "R");
        } while (answer !== "R" && answer !== "T");
        return new Script(
            JSON.parse(json).map((element: any) => {
                if (element.id === '_meta')
                    return Metadata.deserialize(element);
                if (element.id)
                    return Character.deserialize(element);
                return element
            }),

            answer === 'T' ? ScriptType.TEENSYVILLE : ScriptType.RAVENSWOOD_BLUFF
        );
    }

    public charactersOf(team: Team): Character[] {
        return this.characters.filter((character) => character.team === team);
    }

    verify(): Errors {
        const err = new Errors();

        if (this.charactersOf(Team.TOWNSFOLK).length > 0)
            err.messages.push(new Message('At least one Townsfolk must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.OUTSIDER).length > 0)
            err.messages.push(new Message('At least one Outsider must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.MINION).length > 0)
            err.messages.push(new Message('At least one Minion must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.DEMON).length > 0)
            err.messages.push(new Message('At least one Demon must exist', Severity.ERROR, this));

        switch (this.type) {
            case ScriptType.RAVENSWOOD_BLUFF:
                //TODO check for character per team
                break;
            case ScriptType.TEENSYVILLE:
                //TODO check for character per team
                break;
        }

        return err;
    }

    public export(): string {
        return JSON.stringify(this.elements)
    }
}

export enum ScriptType {
    RAVENSWOOD_BLUFF = 'normal',
    TEENSYVILLE = 'small',
}
