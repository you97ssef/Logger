import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import {
    CircleAlertIcon,
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    LucideAngularModule,
    TriangleAlertIcon,
} from 'lucide-angular';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css',
})
export class ToastComponent {
    readonly Check = CircleCheckIcon;
    readonly Error = CircleXIcon;
    readonly Info = InfoIcon;
    readonly Warning = TriangleAlertIcon;

    toastService = inject(ToastService);
}
