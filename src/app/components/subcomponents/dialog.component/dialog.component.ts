import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {crossInCircle} from '../../../icons';
import {DialogService} from './dialog.service';

@Component({
    selector: 'app-dialog-component',
    imports: [
        FormsModule
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    standalone: true
})
export class DialogComponent {
    protected errorMessage: string = "";
    protected readonly crossInCircle = crossInCircle;

    constructor(
        private readonly dialogService: DialogService,
        private readonly cdr: ChangeDetectorRef,
    ) {
        dialogService.openDialog.subscribe(errorMessage => {
            this.displayPopUp(errorMessage);
        })
    }

    private displayPopUp(errorMessage: string): void {
        const modal = document.getElementById('error_modal') as HTMLDialogElement;
        this.errorMessage = errorMessage;
        this.cdr.detectChanges();
        modal.showModal();
    }
}
