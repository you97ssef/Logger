import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import {
    LucideAngularModule,
    UserIcon,
    MailIcon,
    CalendarIcon,
    ShieldIcon,
    EditIcon,
    HomeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from 'lucide-angular';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-me',
    imports: [LucideAngularModule, DatePipe, CommonModule, RouterLink],
    templateUrl: './me.component.html',
    styleUrl: './me.component.css',
})
export class MeComponent implements OnInit {
    readonly UserIcon = UserIcon;
    readonly MailIcon = MailIcon;
    readonly CalendarIcon = CalendarIcon;
    readonly ShieldIcon = ShieldIcon;
    readonly EditIcon = EditIcon;
    readonly HomeIcon = HomeIcon;
    readonly CheckCircleIcon = CheckCircleIcon;
    readonly XCircleIcon = XCircleIcon;

    private userService = inject(UserService);

    user: User | null = null;
    loading = true;

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.userService.getMe().subscribe({
            next: (response) => {
                this.user = response.data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    getRoleName(role: number): string {
        switch (role) {
            case 1:
                return 'User';
            case 2:
                return 'Admin';
            default:
                return 'Unknown';
        }
    }
}
