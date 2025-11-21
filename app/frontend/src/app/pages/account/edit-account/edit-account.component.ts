import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import {
    LucideAngularModule,
    SaveIcon,
    TrashIcon,
    HomeIcon,
    UserIcon,
} from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteAccountDTO, UpdateAccountDTO } from '../../../dtos/user';

@Component({
    selector: 'app-edit-account',
    imports: [
        LucideAngularModule,
        ReactiveFormsModule,
        RouterLink,
        CommonModule,
    ],
    templateUrl: './edit-account.component.html',
    styleUrl: './edit-account.component.css',
})
export class EditAccountComponent implements OnInit {
    readonly SaveIcon = SaveIcon;
    readonly TrashIcon = TrashIcon;
    readonly HomeIcon = HomeIcon;
    readonly UserIcon = UserIcon;

    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private router = inject(Router);

    user: User | null = null;
    loading = true;
    showDeleteModal = false;

    // Account form
    accountForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
    });

    // Delete form
    deleteForm = this.fb.group({
        password: ['', [Validators.required]],
    });

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.userService.getMe().subscribe({
            next: (response) => {
                this.user = response.data;
                this.accountForm.patchValue({
                    name: this.user.Name,
                });
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    onSubmit(): void {
        if (this.accountForm.valid) {
            const dto: UpdateAccountDTO = {
                name: this.accountForm.value.name || '',
            };

            this.userService.updateAccount(dto).subscribe({
                next: () => {
                    this.router.navigateByUrl('/me');
                },
            });
        } else {
            this.accountForm.markAllAsTouched();
        }
    }

    openDeleteModal(): void {
        this.showDeleteModal = true;
        this.deleteForm.reset();
    }

    closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.deleteForm.reset();
    }

    deleteAccount(): void {
        if (this.deleteForm.valid) {
            const dto: DeleteAccountDTO = {
                password: this.deleteForm.value.password || '',
            };

            this.userService.deleteAccount(dto).subscribe({
                next: () => {
                    this.authService.logout();
                    this.router.navigateByUrl('/login');
                },
                error: () => {
                    // Error handling - password might be incorrect
                },
            });
        } else {
            this.deleteForm.markAllAsTouched();
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.accountForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        if (control.errors['required']) {
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } is required`;
        }
        if (control.errors['maxlength']) {
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } must not exceed 255 characters`;
        }
        return '';
    }
}
