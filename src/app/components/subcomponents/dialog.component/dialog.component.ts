import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { icon } from '../../../icons';
import { DialogService } from './dialog.service';
import { Errors } from '../../../models/common';

@Component({
    selector: 'app-dialog-component',
    imports: [FormsModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    standalone: true,
})
export class DialogComponent {
    protected errorMessage: string = '';
    protected validationMessages?: Errors = undefined;
    protected readonly icon = icon;

    constructor(
        private readonly dialogService: DialogService,
        private readonly cdr: ChangeDetectorRef,
    ) {
        dialogService.error.subscribe((errorMessage) => this.errorPopUpdisplayPopUp(errorMessage));
        dialogService.validation.subscribe((validation: Errors) => this.validationPopUpdisplayPopUp(validation));
    }

    private errorPopUpdisplayPopUp(errorMessage: string): void {
        const modal = document.getElementById('error_modal') as HTMLDialogElement;
        this.errorMessage = errorMessage;
        this.cdr.detectChanges();
        modal.showModal();
    }

    private validationPopUpdisplayPopUp(validations: Errors): void {
        const modal = document.getElementById('validation_modal') as HTMLDialogElement;
        this.validationMessages = validations;
        this.cdr.detectChanges();
        modal.showModal();
    }
}
