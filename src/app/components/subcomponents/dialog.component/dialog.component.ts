import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {icon} from '../../../icons';
import {Choice, DialogService} from './dialog.service';
import {Errors, Severity} from '../../../models/common';
import {classes} from './dialog.component.style';

@Component({
    selector: 'app-dialog-component',
    imports: [FormsModule],
    templateUrl: './dialog.component.html',
    standalone: true,
})
export class DialogComponent {
    protected errorMessage: string = '';
    protected validationMessages?: Errors = undefined;
    protected readonly icon = icon;
    protected choice?: Choice = undefined;
    protected readonly classes = classes;

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
        if (validations.highestLevel === Severity.NONE) this.validationMessages = undefined;
        else this.validationMessages = validations;
        this.cdr.detectChanges();
        modal.showModal();
    }

    private choicePopUpdisplayPopUp(choice: Choice): void {
        const modal = document.getElementById('choice_modal') as HTMLDialogElement;
        this.choice = choice;
        this.cdr.detectChanges();
        modal.showModal();
    }
}
