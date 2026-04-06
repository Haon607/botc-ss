import { Errors, Verifiable } from './common';
import { Metadata } from './metadata';
import { Character, DetailedCharacter, Team } from './character';
import { Memory } from '../services/memory.service';
import { CharacterDetailsService } from '../services/character-details.service';
import { ScriptValidator } from './script_validator';

export class Script implements Verifiable {
    constructor(
        public elements: (string | Character | Metadata)[],
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
        return ScriptValidator.validate(this);
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
