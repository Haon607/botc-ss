import { Errors, Message, Severity, Verifiable } from './common';
import { Metadata } from './metadata';
import { Character, DetailedCharacter, Team } from './character';
import { Memory } from '../services/memory.service';
import { CharacterDetailsService } from '../services/character-details.service';

export class Script implements Verifiable {
    constructor(
        private elements: (string | Character | Metadata)[],
        public type: ScriptType,
        public identifier: string,
        private cDS?: CharacterDetailsService,
    ) {}
    public get metadata(): Metadata {
        const metadata = this.elements.find((element) => element instanceof Metadata);
        if (metadata) return metadata;
        throw new Error(`No element instanceOf Metadata could be found in ${JSON.stringify(this.elements)}`);
    }

    public get characters(): DetailedCharacter[] {
        return this.elements
            .filter((element) => typeof element === 'string' || element instanceof Character)
            .map((element) => this.cDS!.toCharacter(element));
    }

    static deserialize(deadScript: string | Script, cDS: CharacterDetailsService): Script {
        /*TODO ugly ahh method*/
        if (typeof deadScript === 'string') {
            /*TODO pop up*/
            let answer: string | null;
            do {
                answer = prompt('(R)avenswood_Bluff or (T)eensyville?', 'R');
            } while (answer !== 'R' && answer !== 'T');

            return new Script(
                JSON.parse(deadScript).map((element: any) => {
                    if (element.id === '_meta') return Metadata.deserialize(element);
                    if (element.id) return Character.deserialize(element);
                    return element;
                }),
                answer === 'T' ? ScriptType.TEENSYVILLE : ScriptType.RAVENSWOOD_BLUFF,
                crypto.randomUUID(),
                cDS,
            );
        } else
            return new Script(
                deadScript.elements.map((element: any) => {
                    if (element.id === '_meta') return Metadata.deserialize(element);
                    if (element.id) return Character.deserialize(element);
                    return element;
                }),
                deadScript.type,
                deadScript.identifier,
                cDS,
            );
    }

    public charactersOf(team: Team): DetailedCharacter[] {
        return this.characters.filter((character) => character.details.team === team);
    }

    verify(): Errors {
        const err = new Errors();

        if (this.charactersOf(Team.TOWNSFOLK).length === 0)
            err.messages.push(new Message('At least one Townsfolk must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.OUTSIDER).length === 0)
            err.messages.push(new Message('At least one Outsider must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.MINION).length === 0)
            err.messages.push(new Message('At least one Minion must exist', Severity.ERROR, this));
        if (this.charactersOf(Team.DEMON).length === 0)
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
        return JSON.stringify(this.elements);
    }

    /**
     * No clue what flush means,
     * methods updates this Script in the List-of-Script from the Memory.
     * This Method searches for the same "identifier" and updates any script the identifier matched.
     * If no script matching identifier is found, throws an error.
     * @param memory
     */
    public flush(memory: Memory): void {
        let scripts = memory.scripts.get() ?? [];
        let scriptFound = false;

        scripts = scripts.map((memoryScript) => {
            if (memoryScript.identifier === this.identifier) {
                scriptFound = true;
                return this;
            } else return memoryScript;
        });

        if (!scriptFound)
            throw new Error(
                'Could not update script in Memory, no Script matching identifier was found in Memory.\nTried to update: ' +
                    JSON.stringify(this),
            );

        memory.scripts.set(scripts);
    }

    public stripped(): this {
        const stripped = { ...this };
        stripped.cDS = undefined;
        return stripped;
    }

    public removeElement(elementToRemove: Character | string, memory: Memory) {
        this.elements = this.elements.filter((element) => {
            return element !== elementToRemove;
        });
        this.flush(memory);
    }
}

export enum ScriptType {
    RAVENSWOOD_BLUFF = 'normal',
    TEENSYVILLE = 'small',
}
