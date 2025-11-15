import { Injectable, WritableSignal, signal } from '@angular/core';
import { Toast } from '../entities/toast';

const TOAST_DURATION = 5000;

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toasts: WritableSignal<Toast[]> = signal([]);

    show(toast: Toast): void {
        this.toasts().push(toast);
        setTimeout(() => this.toasts().shift(), TOAST_DURATION);
    }
}
