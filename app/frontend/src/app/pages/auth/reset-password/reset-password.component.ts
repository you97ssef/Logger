import { Component, inject, OnInit } from '@angular/core';
import {
    LucideAngularModule,
    LogInIcon,
    UserPlusIcon,
    RotateCcwKeyIcon,
    EyeIcon,
    EyeOffIcon,
} from 'lucide-angular';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordDTO } from '../../../dtos/auth';

@Component({
    selector: 'app-reset-password',
    imports: [LucideAngularModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    readonly LogInIcon = LogInIcon;
    readonly RegisterIcon = UserPlusIcon;
    readonly ForgotPasswordIcon = RotateCcwKeyIcon;
    readonly EyeIcon = EyeIcon;
    readonly EyeOffIcon = EyeOffIcon;

    // UI state
    showPassword = false;
    showConfirmPassword = false;
    token: string = '';

    // Reactive form
    resetPasswordForm = this.fb.group(
        {
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(255),
                ],
            ],
            confirm_password: ['', [Validators.required]],
        },
        { validators: this.passwordMatchValidator }
    );

    // Error messages
    errorMessages: { [key: string]: { [key: string]: string } } = {
        password: {
            required: 'Password is required',
            minlength: 'Password must be at least 8 characters',
            maxlength: 'Password must not exceed 255 characters',
        },
        confirm_password: {
            required: 'Please confirm your password',
        },
    };

    ngOnInit(): void {
        // Extract token from query params
        this.route.queryParams.subscribe((params) => {
            this.token = params['token'] || '';
        });
    }

    togglePassword(which: 'main' | 'confirm' = 'main'): void {
        if (which === 'confirm') {
            this.showConfirmPassword = !this.showConfirmPassword;
        } else {
            this.showPassword = !this.showPassword;
        }
    }

    // Custom validator to check if passwords match
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirm_password');

        if (!password || !confirmPassword) {
            return null;
        }

        return password.value === confirmPassword.value
            ? null
            : { passwordMismatch: true };
    }

    getErrorMessage(fieldName: string): string {
        const control = this.resetPasswordForm.get(fieldName);
        const errors: string[] = [];

        if (control && control.errors && control.touched) {
            Object.keys(control.errors).forEach((errorKey) => {
                const message = this.errorMessages[fieldName]?.[errorKey];
                if (message) {
                    errors.push(message);
                }
            });
        }

        // Check for form-level password mismatch error
        if (
            fieldName === 'confirm_password' &&
            this.resetPasswordForm.hasError('passwordMismatch') &&
            control?.touched
        ) {
            errors.push('Passwords do not match');
        }

        return errors.join(' - ');
    }

    onSubmit(): void {
        if (this.resetPasswordForm.valid && this.token) {
            const resetPasswordDTO: ResetPasswordDTO = {
                token: this.token,
                password: this.resetPasswordForm.value.password!,
                confirm_password:
                    this.resetPasswordForm.value.confirm_password!,
            };
            this.authService.resetPassword(resetPasswordDTO).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
            });
        } else {
            this.resetPasswordForm.markAllAsTouched();
        }
    }
}
