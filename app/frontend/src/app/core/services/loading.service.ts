import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    loaders: WritableSignal<number> = signal(0);

    addLoader(): void {
        this.loaders.update((value) => value + 1);
    }

    removeLoader(): void {
        this.loaders.update((value) => {
            const newValue = value - 1;
            
            return newValue < 0 ? 0 : newValue;
        });
    }
}
