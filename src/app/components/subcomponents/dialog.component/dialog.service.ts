import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Errors } from '../../../models/common';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    public error: Subject<string> = new Subject<string>();
    public validation: Subject<Errors> = new Subject<Errors>();
}
