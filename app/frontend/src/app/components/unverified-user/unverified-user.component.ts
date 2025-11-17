import { Component, inject } from '@angular/core';
import { LucideAngularModule, MailIcon, ShieldAlertIcon } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-unverified-user',
    imports: [LucideAngularModule],
    templateUrl: './unverified-user.component.html',
    styleUrl: './unverified-user.component.css',
})
export class UnverifiedUserComponent {
    readonly Alert = ShieldAlertIcon;
    readonly Mail = MailIcon;

    emailSent = false;
    authService = inject(AuthService);

    sendVerificationEmail(): void {
        this.authService
            .resendVerification(this.authService.me()!.email)
            .subscribe(() => {
                this.emailSent = true;
            });
    }
}
