import { Component, EventEmitter, Input, Output } from '@angular/core';
import { icon } from '../../../icons';
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
    @Output() removeCharacter: EventEmitter<DetailedCharacter> = new EventEmitter();
    protected readonly icon = icon;

    protected get isCustomCharacter() {
        return typeof this.character.originalElement !== 'string';
    }

    protected removeCharacterFromScript() {
        this.removeCharacter.emit(this.character);
    }
}
