import { Component, inject } from '@angular/core';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CircleUserRoundIcon,
    EllipsisIcon,
    FileTextIcon,
    LogOutIcon,
    LucideAngularModule,
    MailIcon,
    PencilIcon,
    PlusIcon,
    TriangleAlertIcon,
    UnplugIcon,
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    readonly Back = ArrowLeftIcon;
    readonly Logout = LogOutIcon;
    readonly Profiles = FileTextIcon;
    readonly Account = CircleUserRoundIcon;
    readonly MyAccount = ArrowRightIcon;
    readonly EditProfile = PencilIcon;
    readonly Email = MailIcon;
    readonly New = PlusIcon;
    readonly SeeMore = EllipsisIcon;
    readonly Integration = UnplugIcon;

    authService = inject(AuthService);
    router = inject(Router);

    drawerOpen = false;
    year = new Date().getFullYear();

    closeDrawer(): void {
        this.drawerOpen = false;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
