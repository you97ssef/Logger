import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private modal: HTMLDialogElement | null = null;
    public title: string = '';
    public body: string = '';
    public success: boolean = false;

    setModal(modal: HTMLDialogElement): void {
        this.modal = modal;
    }

    confirm(title: string, body: string): Promise<boolean> {
        this.title = title;
        this.body = body;
        this.success = false;

        return new Promise((resolve) => {
            const handleClose = () => {
                this.modal?.removeEventListener('close', handleClose);
                resolve(this.success);
            };

            this.modal?.addEventListener('close', handleClose);
            this.modal?.showModal();
        });
    }
}
