import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UnverifiedUserComponent } from '../../components/unverified-user/unverified-user.component';
import { ProfileService } from '../../services/profile.service';
import { BadgeCheckIcon, BadgeXIcon, CalendarIcon, FileTextIcon, LucideAngularModule, PlusIcon } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { Profile } from '../../models/profile';

@Component({
    selector: 'app-home',
    imports: [UnverifiedUserComponent, LucideAngularModule, DatePipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    readonly Calendar = CalendarIcon;
    readonly Verified = BadgeCheckIcon;
    readonly NotVerified = BadgeXIcon;
    readonly New = PlusIcon;
    readonly ProfilesIcon = FileTextIcon;

    authService = inject(AuthService);
    router = inject(Router);
    profileService = inject(ProfileService);

    profiles: Profile[] | null = null;

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    ngOnInit(): void {
        this.profileService.getProfiles().subscribe(response => {
            this.profiles = response.data;
        });
    }

    firstWord(name: string): string {
        return name.split(' ')[0];
    }
}
