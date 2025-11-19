import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UnverifiedUserComponent } from '../../components/unverified-user/unverified-user.component';
import { ProfileService } from '../../services/profile.service';
import {
    BadgeCheckIcon,
    BadgeXIcon,
    CalendarIcon,
    FileTextIcon,
    LucideAngularModule,
    PlusIcon,
    EditIcon,
    TrashIcon,
    EyeIcon,
    CopyIcon,
    ActivityIcon,
    BellIcon,
    MoreVerticalIcon,
} from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { Profile } from '../../models/profile';

@Component({
    selector: 'app-home',
    imports: [
        UnverifiedUserComponent,
        LucideAngularModule,
        DatePipe,
        RouterLink,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    readonly Calendar = CalendarIcon;
    readonly Verified = BadgeCheckIcon;
    readonly NotVerified = BadgeXIcon;
    readonly New = PlusIcon;
    readonly ProfilesIcon = FileTextIcon;
    readonly EditIcon = EditIcon;
    readonly TrashIcon = TrashIcon;
    readonly EyeIcon = EyeIcon;
    readonly CopyIcon = CopyIcon;
    readonly ActivityIcon = ActivityIcon;
    readonly BellIcon = BellIcon;
    readonly MoreVerticalIcon = MoreVerticalIcon;

    authService = inject(AuthService);
    router = inject(Router);
    profileService = inject(ProfileService);

    profiles: Profile[] | null = null;

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    ngOnInit(): void {
        this.profileService.getProfiles().subscribe((response) => {
            this.profiles = response.data;
        });
    }

    firstWord(name: string): string {
        return name.split(' ')[0];
    }

    copyToken(token: string): void {
        navigator.clipboard.writeText(token);
    }

    deleteProfile(id: string): void {
        if (confirm('Are you sure you want to delete this profile?')) {
            this.profileService.deleteProfile(id).subscribe(() => {
                this.profiles = this.profiles!.filter((p) => p.ID !== id);
            });
        }
    }

    getTrackerCount(trackers: string | null): number {
        if (!trackers || trackers.trim() === '') return 0;
        return trackers.split(';').filter((t) => t.trim() !== '').length;
    }

    viewLogs(id: string): void {
        this.router.navigateByUrl(`/logs/${id}`);
    }
}
