import {Component, Input} from '@angular/core';
import {Script} from '../../model/script';
import {CharacterComponent} from '../character.component/character.component';

@Component({
    selector: 'app-script-component',
    imports: [
        CharacterComponent
    ],
    templateUrl: './script.component.html',
    styleUrl: './script.component.css',
})
export class ScriptComponent {
    @Input({required: true}) script!: Script;
}
