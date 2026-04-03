import { Injectable } from '@angular/core';
import {Store} from './store';
import {Script} from '../models/script';

@Injectable({
    providedIn: 'root',
})
export class Memory {
    scripts = new Store<Script[]>('scripts');
}
