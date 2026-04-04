import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from './components/subcomponents/dialog.component/dialog.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DialogComponent],
    templateUrl: './app.html',
    standalone: true,
    styleUrl: './app.css',
})
export class App {}
