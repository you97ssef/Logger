import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, LogInIcon, HouseIcon } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-verify',
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './verify.component.html',
    styleUrl: './verify.component.css',
})
export class VerifyComponent implements OnInit {
    readonly Home = HouseIcon;

    authService = inject(AuthService);
    route = inject(ActivatedRoute);

    verified = false;

    ngOnInit(): void {
        const token = this.route.snapshot.queryParams['token'] || '';

        this.authService.verifyEmail(token).subscribe({
            next: () => {
                this.verified = true;
            },
        });
    }
}
