import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UnverifiedUserComponent } from '../../components/unverified-user/unverified-user.component';
import { ForgotPasswordComponent } from "../auth/forgot-password/forgot-password.component";
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-home',
    imports: [UnverifiedUserComponent, ForgotPasswordComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    authService = inject(AuthService);
    router = inject(Router);
    profileService = inject(ProfileService);

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }


    ngOnInit(): void {
        this.profileService.getProfiles().subscribe(profiles => {
            console.log('Fetched profiles:', profiles);
        });
    }
}
