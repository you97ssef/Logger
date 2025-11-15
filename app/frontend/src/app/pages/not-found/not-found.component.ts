import { Component } from '@angular/core';
import { ArrowLeftIcon, HouseIcon, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-not-found',
    imports: [LucideAngularModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
    readonly Back = ArrowLeftIcon;
    readonly Home = HouseIcon;

    goBack(): void {
        window.history.back();
    }
}
