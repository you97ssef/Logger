import { Component, inject } from '@angular/core';
import {
    LogInIcon,
    LucideAngularModule,
    RotateCcwKeyIcon,
    UserPlusIcon,
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
import { Router, RouterLink } from '@angular/router';
import { RegisterDTO } from '../../../dtos/auth';

@Component({
    selector: 'app-register',
    imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    readonly LogInIcon = LogInIcon;
    readonly RegisterIcon = UserPlusIcon;
    readonly ForgotPasswordIcon = RotateCcwKeyIcon;
    readonly EyeIcon = EyeIcon;
    readonly EyeOffIcon = EyeOffIcon;

    // UI state
    showPassword = false;
    showConfirmPassword = false;

    // Reactive form
    registerForm = this.fb.group(
        {
            name: ['', [Validators.required, Validators.maxLength(255)]],
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(255),
                ],
            ],
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
        name: {
            required: 'Name is required',
            maxlength: 'Name must not exceed 255 characters',
        },
        email: {
            required: 'Email is required',
            email: 'Please enter a valid email address',
            maxlength: 'Email must not exceed 255 characters',
        },
        password: {
            required: 'Password is required',
            minlength: 'Password must be at least 8 characters',
            maxlength: 'Password must not exceed 255 characters',
        },
        confirm_password: {
            required: 'Please confirm your password',
        },
    };

    togglePassword(which: 'main' | 'confirm' = 'main'): void {
        if (which === 'confirm') {
            this.showConfirmPassword = !this.showConfirmPassword;
        } else {
            this.showPassword = !this.showPassword;
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.registerForm.get(fieldName);
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
            this.registerForm.hasError('passwordMismatch') &&
            control?.touched
        ) {
            errors.push('Passwords do not match');
        }

        return errors.join(' - ');
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

    onSubmit(): void {
        if (this.registerForm.valid) {
            const registerDTO: RegisterDTO = this.registerForm
                .value as RegisterDTO;
            this.authService.register(registerDTO).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
