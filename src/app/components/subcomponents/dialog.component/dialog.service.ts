import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    public openDialog: Subject<string> = new Subject<string>();
}
