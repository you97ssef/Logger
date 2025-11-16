import { Component, inject } from '@angular/core';
import {
    LucideAngularModule,
    LogInIcon,
    UserPlusIcon,
    RotateCcwKeyIcon,
} from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    readonly LogInIcon = LogInIcon;
    readonly RegisterIcon = UserPlusIcon;
    readonly ForgotPasswordIcon = RotateCcwKeyIcon;

    // Reactive form
    forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
    });

    // Error messages
    errorMessages: { [key: string]: { [key: string]: string } } = {
        email: {
            required: 'Email is required',
            email: 'Please enter a valid email address',
        },
    };

    getErrorMessage(fieldName: string): string {
        const control = this.forgotPasswordForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        const errors = Object.keys(control.errors)
            .map((errorKey) => this.errorMessages[fieldName]?.[errorKey] || '')
            .filter((msg) => msg !== '');

        return errors.join(' - ');
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.value.email!;
            this.authService.forgotPassword(email).subscribe({
                next: () => {
                    // Show success message
                    this.forgotPasswordForm.reset();
                },
                error: (error) => {
                    console.error('Forgot password failed:', error);
                },
            });
        } else {
            this.forgotPasswordForm.markAllAsTouched();
        }
    }
}
