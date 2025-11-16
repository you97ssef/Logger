import { Component, inject } from '@angular/core';
import { LogOutIcon, LucideAngularModule, MenuIcon } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    readonly Menu = MenuIcon;
    readonly Logout = LogOutIcon;

    authService = inject(AuthService);

    get Initials(): string {
        return this.authService
            .me()!
            .name.split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }

    logout(): void {
        this.authService.logout();
    }
}
