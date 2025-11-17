import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { BanIcon, CheckIcon, LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
})
export class ModalComponent {
    readonly Confirm = CheckIcon;
    readonly Close = XIcon;
    readonly Cancel = BanIcon;

    @ViewChild('md') modal!: ElementRef<HTMLDialogElement>;

    modalService: ModalService = inject(ModalService);

    ngAfterViewInit(): void {
        this.modalService.setModal(this.modal.nativeElement);
    }

    close(result: boolean): void {
        this.modalService.success = result;
        this.modal.nativeElement.close();
    }
}
