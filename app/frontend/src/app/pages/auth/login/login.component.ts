import { Component, inject } from '@angular/core';
import {
    LucideAngularModule,
    LogInIcon,
    UserPlusIcon,
    RotateCcwKeyIcon,
    EyeIcon,
    EyeOffIcon,
} from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LoginDTO } from '../../../dtos/auth';

@Component({
    selector: 'app-login',
    imports: [LucideAngularModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    readonly LogInIcon = LogInIcon;
    readonly RegisterIcon = UserPlusIcon;
    readonly ForgotPasswordIcon = RotateCcwKeyIcon;
    readonly EyeIcon = EyeIcon;
    readonly EyeOffIcon = EyeOffIcon;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    showPassword = false;

    // Reactive form
    loginForm = this.fb.group({
        email: [
            '',
            [Validators.required, Validators.email, Validators.maxLength(255)],
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(255),
            ],
        ],
    });

    // Error messages
    errorMessages: { [key: string]: { [key: string]: string } } = {
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
    };

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    getErrorMessage(fieldName: string): string {
        const control = this.loginForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        const errors = Object.keys(control.errors)
            .map((errorKey) => this.errorMessages[fieldName]?.[errorKey] || '')
            .filter((msg) => msg !== '');

        return errors.join(' - ');
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const loginDTO: LoginDTO = this.loginForm.value as LoginDTO;
            this.authService.login(loginDTO).subscribe({
                next: () => {
                    this.router.navigateByUrl('/');
                },
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
