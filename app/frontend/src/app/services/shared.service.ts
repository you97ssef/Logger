import { Injectable, signal, WritableSignal } from '@angular/core';
import { Profile } from '../models/profile';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    profiles: WritableSignal<Profile[] | null> = signal(null);
}
