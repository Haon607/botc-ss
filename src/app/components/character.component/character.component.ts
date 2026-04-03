import {Component, Input} from '@angular/core';
import {Character} from '../../model/character';

@Component({
    selector: 'app-character-component',
    imports: [],
    templateUrl: './character.component.html',
    styleUrl: './character.component.css',
})
export class CharacterComponent {
    @Input({required: true}) character!: Character;
}
