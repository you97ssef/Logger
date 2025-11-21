import { Component, inject, OnInit } from '@angular/core';
import {
    LucideAngularModule,
    SaveIcon,
    HomeIcon,
    TrashIcon,
    PlusIcon,
    SmartphoneIcon,
    MailIcon,
} from 'lucide-angular';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
    FormArray,
    FormGroup,
} from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UpdateProfileDTO, Tracker } from '../../../dtos/profile';
import { Profile } from '../../../models/profile';
import { CommonModule } from '@angular/common';
import { TrackerHelper } from '../../../helpers/tracker';

@Component({
    selector: 'app-edit-profile',
    imports: [
        LucideAngularModule,
        ReactiveFormsModule,
        RouterLink,
        CommonModule,
    ],
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
    readonly SaveIcon = SaveIcon;
    readonly HomeIcon = HomeIcon;
    readonly TrashIcon = TrashIcon;
    readonly CreateIcon = PlusIcon;
    readonly SmartphoneIcon = SmartphoneIcon;
    readonly MailIcon = MailIcon;

    private fb = inject(FormBuilder);
    private profileService = inject(ProfileService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    profileId: string = '';
    profile: Profile | null = null;
    loading = true;

    // Reactive form
    profileForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        trackers: this.fb.array([]),
    });

    get trackers(): FormArray {
        return this.profileForm.get('trackers') as FormArray;
    }

    ngOnInit() {
        this.profileId = this.route.snapshot.paramMap.get('id') || '';
        if (this.profileId) {
            this.loadProfile();
        } else {
            this.router.navigateByUrl('/');
        }
    }

    loadProfile() {
        this.profileService.getProfiles().subscribe({
            next: (response) => {
                this.profile =
                    response.data.find((p) => p.ID === this.profileId) || null;
                if (this.profile) {
                    this.populateForm();
                } else {
                    this.router.navigateByUrl('/');
                }
                this.loading = false;
            },
            error: () => {
                this.router.navigateByUrl('/');
            },
        });
    }

    populateForm() {
        if (!this.profile) return;

        this.profileForm.patchValue({
            name: this.profile.Name,
        });

        // Parse and populate trackers
        const trackers = TrackerHelper.stringToTrackers(this.profile.Trackers);
        this.trackers.clear();
        trackers.forEach((tracker) => {
            const group = this.createTrackerFormGroup();
            // Set platform boolean flags based on platform value
            const platformNum = Number(tracker.platform);
            const inApp = platformNum === 1 || platformNum === 3;
            const email = platformNum === 2 || platformNum === 3;
            group.patchValue({
                ...tracker,
                inApp,
                email,
            });
            this.trackers.push(group);
        });
    }

    createTrackerFormGroup(): FormGroup {
        return this.fb.group(
            {
                name: ['', [Validators.required, Validators.maxLength(64)]],
                pattern: ['', [Validators.required, Validators.maxLength(64)]],
                platform: [1, [Validators.required]],
                inApp: [true],
                email: [false],
            },
            { validators: this.platformValidator }
        );
    }

    platformValidator(group: FormGroup) {
        const inApp = group.get('inApp')?.value;
        const email = group.get('email')?.value;
        return inApp || email ? null : { platformRequired: true };
    }

    addTracker() {
        this.trackers.push(this.createTrackerFormGroup());
    }

    removeTracker(index: number) {
        this.trackers.removeAt(index);
    }

    togglePlatform(index: number, type: 'inApp' | 'email') {
        const tracker = this.trackers.at(index) as FormGroup;
        const currentValue = tracker.get(type)?.value;
        const otherType = type === 'inApp' ? 'email' : 'inApp';
        const otherValue = tracker.get(otherType)?.value;

        // Prevent deselecting if it's the only one selected
        if (currentValue && !otherValue) {
            return;
        }

        tracker.patchValue({ [type]: !currentValue });
        this.updatePlatformValue(index);
    }

    updatePlatformValue(index: number) {
        const tracker = this.trackers.at(index) as FormGroup;
        const inApp = tracker.get('inApp')?.value;
        const email = tracker.get('email')?.value;

        let platform = 1; // Default to InApp
        if (inApp && email) {
            platform = 3; // Both
        } else if (email) {
            platform = 2; // Email only
        } else {
            platform = 1; // InApp only
        }

        tracker.patchValue({ platform }, { emitEvent: false });
    }

    // Error messages
    errorMessages: { [key: string]: { [key: string]: string } } = {
        name: {
            required: 'Profile name is required',
            maxlength: 'Profile name must not exceed 255 characters',
        },
        trackerName: {
            required: 'Tracker name is required',
            maxlength: 'Tracker name must not exceed 64 characters',
        },
        pattern: {
            required: 'Pattern is required',
            maxlength: 'Pattern must not exceed 64 characters',
        },
        platform: {
            required: 'Platform is required',
            platformRequired: 'At least one platform must be selected',
        },
    };

    getErrorMessage(fieldName: string): string {
        const control = this.profileForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        const errors = Object.keys(control.errors)
            .map((errorKey) => this.errorMessages[fieldName]?.[errorKey] || '')
            .filter((msg) => msg !== '');

        return errors.join(' - ');
    }

    getTrackerErrorMessage(index: number, fieldName: string): string {
        const trackerGroup = this.trackers.at(index) as FormGroup;

        // Check for group-level errors (platform validation)
        if (
            fieldName === 'platform' &&
            trackerGroup.errors?.['platformRequired'] &&
            trackerGroup.touched
        ) {
            return this.errorMessages['platform']['platformRequired'];
        }

        const control = trackerGroup.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        const errorKey = fieldName === 'name' ? 'trackerName' : fieldName;
        const errors = Object.keys(control.errors)
            .map((err) => this.errorMessages[errorKey]?.[err] || '')
            .filter((msg) => msg !== '');

        return errors.join(' - ');
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            const formValue = this.profileForm.value;

            const updateProfileDTO: UpdateProfileDTO = {
                name: formValue.name || '',
                trackers:
                    formValue.trackers && formValue.trackers.length > 0
                        ? (formValue.trackers as Tracker[])
                        : null,
            };

            this.profileService
                .updateProfile(this.profileId, updateProfileDTO)
                .subscribe({
                    next: () => {
                        this.router.navigateByUrl('/');
                    },
                });
        } else {
            this.profileForm.markAllAsTouched();
        }
    }

    deleteProfile(): void {
        if (
            confirm(
                'Are you sure you want to delete this profile? This action cannot be undone and will delete all associated logs.'
            )
        ) {
            this.profileService.deleteProfile(this.profileId).subscribe({
                next: () => {
                    this.router.navigateByUrl('/');
                },
            });
        }
    }
}
