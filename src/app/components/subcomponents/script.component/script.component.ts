import { Component, Input } from '@angular/core';
import { Script } from '../../../models/script';
import { CharacterComponent } from '../character.component/character.component';
import { Team } from '../../../models/character';

@Component({
    selector: 'app-script-component',
    imports: [CharacterComponent],
    templateUrl: './script.component.html',
    styleUrl: './script.component.css',
    standalone: true,
})
export class ScriptComponent {
    @Input({ required: true }) script!: Script;

    constructor() {}

    protected readonly Team = Team;
}
