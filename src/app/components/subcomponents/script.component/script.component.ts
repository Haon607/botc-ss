import { Component, Input } from '@angular/core';
import { Script } from '../../../models/script';
import { CharacterComponent } from '../character.component/character.component';
import { DetailedCharacter, Team } from '../../../models/character';
import { FormsModule } from '@angular/forms';
import { icon } from '../../../icons';
import { classes } from './script.component.styles';
import { DialogService } from '../dialog.component/dialog.service';
import { Memory } from '../../../services/memory.service';

@Component({
    selector: 'app-script-component',
    imports: [CharacterComponent, FormsModule],
    templateUrl: './script.component.html',
    standalone: true,
})
export class ScriptComponent {
    @Input({ required: true }) script!: Script;
    protected readonly Team = Team;
    protected readonly classes = classes;
    protected readonly icon = icon;

    constructor(
        private readonly dialog: DialogService,
        private readonly memory: Memory,
    ) {}

    protected showValidation() {
        this.dialog.validation.next(this.script.verify());
    }

    protected removeCharacter(character: DetailedCharacter) {
        this.script.removeElement(character.originalElement, this.memory);
    }
}
