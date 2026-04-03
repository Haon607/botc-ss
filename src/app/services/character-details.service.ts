import { Character } from '../models/character';
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

    public toCharacter(idOrCustomCharacter: Character | string): Character {
        if (idOrCustomCharacter instanceof Character) return idOrCustomCharacter;

        if (!this.roles) {
            this.dialogService.error.next('Error loading roles from https://release.botc.app/');
            throw new Error('Error fetching roles');
        }

        const character = this.roles.find((c) => c.id === idOrCustomCharacter);
        if (!character) {
            this.dialogService.error.next('No built-in Character with id ${idOrCustomCharacter} found');
            throw new Error(`No built-in Character with id ${idOrCustomCharacter} found`);
        }

        return character;
    }
}
