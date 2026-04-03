import { Component, Input } from '@angular/core';
import { convertToCustomCharacter, editCustomCharacter, plus, trash } from '../../../icons';
import { DetailedCharacter } from '../../../models/character';

@Component({
    selector: 'app-character-component',
    imports: [],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css',
    standalone: true,
})
export class CharacterComponent {
    @Input({ required: true }) character!: DetailedCharacter;
    protected readonly trash = trash;
    protected readonly plus = plus;

    protected get isCustomCharacter() {
        return typeof this.character.originalElement !== 'string';
    }

    protected readonly editCustomCharacter = editCustomCharacter;
    protected readonly convertToCustomCharacter = convertToCustomCharacter;
}
