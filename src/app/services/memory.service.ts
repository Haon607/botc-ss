import { Injectable } from '@angular/core';
import {Store} from './store';
import {Script} from '../model/script';

@Injectable({
    providedIn: 'root',
})
export class Memory {
    scripts = new Store<Script[]>('scripts');
}
