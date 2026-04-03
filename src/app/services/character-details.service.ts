import { Character, DetailedCharacter, Team } from '../models/character';
import { Injectable } from '@angular/core';
import { Botc } from './botc-resource.service';
import { DialogService } from '../components/subcomponents/dialog.component/dialog.service';

@Injectable({
    providedIn: 'root',
})
export class CharacterDetailsService {
    private roles: Character[] | null = null;

    constructor(
        private readonly botc: Botc,
        private readonly dialogService: DialogService,
    ) {}

    async init(): Promise<void> {
        const result = await this.botc.roles();
        this.roles = JSON.parse(JSON.stringify(result));
    }

    public toCharacter(idOrCustomCharacter: Character | string): DetailedCharacter {
        if (idOrCustomCharacter instanceof Character)
            return { details: idOrCustomCharacter, originalElement: idOrCustomCharacter };

        if (!this.roles) {
            this.dialogService.error.next('Error loading roles from https://release.botc.app/');
            throw new Error('Error fetching roles');
        }

        const character = this.roles.find((character) => character.id === idOrCustomCharacter);
        if (!character) {
            this.dialogService.error.next('No built-in Character with id ${idOrCustomCharacter} found');
            throw new Error(`No built-in Character with id ${idOrCustomCharacter} found`);
        }

        character.image = this.resourceImageString(character);

        return { details: character, originalElement: idOrCustomCharacter };
    }

    private resourceImageString(character: Character): string {
        return `https://release.botc.app/resources/characters/${character.edition}/${character.id}${this.alignmentString(character.team)}.webp`;
    }

    private alignmentString(alignment: Team): string {
        switch (alignment) {
            case Team.TOWNSFOLK:
            case Team.OUTSIDER:
                return `_g`;
            case Team.MINION:
            case Team.DEMON:
                return `_e`;
            default:
                return ``;
        }
    }
}
