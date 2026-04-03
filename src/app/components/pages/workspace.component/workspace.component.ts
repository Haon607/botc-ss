import {ChangeDetectorRef, Component} from '@angular/core';
import {Memory} from '../../../services/memory.service';
import {Script} from '../../../models/script';
import {ScriptComponent} from '../../subcomponents/script.component/script.component';
import {crossInCircle, update} from '../../../icons';
import {SchemaValidator} from '../../../services/schema-validator';

@Component({
    selector: 'app-workspace.component',
    imports: [
        ScriptComponent
    ],
    templateUrl: './workspace.component.html',
    styleUrl: './workspace.component.css',
})
export class WorkspaceComponent {
    protected scripts: Script[];
    protected importError: string = '';
    protected readonly update = update;
    protected readonly crossInCircle = crossInCircle;

    constructor(
        private readonly memory: Memory,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.scripts = memory.scripts.get() ?? []

        memory.scripts.changeSubject.subscribe(change => {
            this.scripts = change ?? [];
        })
    }

    protected async pasteImport() {
        const raw = await navigator.clipboard.readText();

        const result = SchemaValidator.validateJsonString(raw);

        const error_paste_modal = document.getElementById('error_paste_modal') as HTMLDialogElement;
        const paste_modal = document.getElementById('paste_modal') as HTMLDialogElement;

        this.importError = '';

        paste_modal.close();

        switch (result) {
            case 'success':
                break;
            case 'generic_error':
                this.importError = "This shouldn't happen, if it did... curious...";
                break;
            case 'json_parse_failed':
                this.importError = 'Pasted content could not be parsed into a JSON';
                break;
            default:
                console.error("Json schema validation failed", result)
                this.importError = "JSON schema validation failed (details in console)";
        }

        if (this.importError.length > 0) {
            this.cdr.detectChanges();
            error_paste_modal.showModal();
            return;
        }

        try {
            const scripts = (this.memory.scripts.get() ?? [])
            scripts.push(Script.deserialize(raw));
            this.memory.scripts.set(scripts);
        } catch (e) {
            console.error("Converting JSON into Objects failed!", e);
            this.importError = "Converting JSON into Objects failed (details in console)";
        }
    }
}
