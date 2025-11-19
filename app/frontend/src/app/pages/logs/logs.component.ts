import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    LucideAngularModule,
    HomeIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    AlertCircleIcon,
    InfoIcon,
    AlertTriangleIcon,
    BugIcon,
    FileTextIcon,
    CalendarIcon,
    ClockIcon,
    EditIcon,
    MoreVerticalIcon,
    SendIcon,
    WifiIcon,
    WifiOffIcon,
} from 'lucide-angular';
import { EntryService } from '../../services/entry.service';
import { ProfileService } from '../../services/profile.service';
import { Entry } from '../../models/entry';
import { Profile } from '../../models/profile';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-logs',
    imports: [
        LucideAngularModule,
        RouterLink,
        DatePipe,
        CommonModule,
        FormsModule,
    ],
    templateUrl: './logs.component.html',
    styleUrl: './logs.component.css',
})
export class LogsComponent implements OnInit, OnDestroy {
    readonly HomeIcon = HomeIcon;
    readonly TrashIcon = TrashIcon;
    readonly ChevronLeftIcon = ChevronLeftIcon;
    readonly ChevronRightIcon = ChevronRightIcon;
    readonly AlertCircleIcon = AlertCircleIcon;
    readonly InfoIcon = InfoIcon;
    readonly AlertTriangleIcon = AlertTriangleIcon;
    readonly BugIcon = BugIcon;
    readonly FileTextIcon = FileTextIcon;
    readonly CalendarIcon = CalendarIcon;
    readonly ClockIcon = ClockIcon;
    readonly EditIcon = EditIcon;
    readonly MoreVerticalIcon = MoreVerticalIcon;
    readonly SendIcon = SendIcon;
    readonly WifiIcon = WifiIcon;
    readonly WifiOffIcon = WifiOffIcon;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private entryService = inject(EntryService);
    private profileService = inject(ProfileService);

    profileId: string = '';
    profile: Profile | null = null;
    entries: Entry[] = [];
    totalEntries: number = 0;
    currentPage: number = 1;
    pageSize: number = 20;
    loading: boolean = true;
    loadingEntries: boolean = false;
    searchTerm: string = '';
    filteredEntries: Entry[] = [];

    // WebSocket for real-time updates
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    wsConnected: boolean = false;

    ngOnInit(): void {
        this.profileId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.profileId) {
            this.router.navigateByUrl('/');
            return;
        }
        this.loadProfileAndEntries();
    }

    loadProfileAndEntries(): void {
        this.loading = true;
        // Load profile details
        this.profileService.getProfiles().subscribe({
            next: (response) => {
                this.profile =
                    response.data.find((p) => p.ID === this.profileId) || null;
                if (!this.profile) {
                    this.router.navigateByUrl('/');
                    return;
                }
                this.loadEntries();
                this.loadEntryCount();
                this.connectWebSocket();
            },
            error: () => {
                this.router.navigateByUrl('/');
            },
        });
    }

    loadEntries(): void {
        this.loadingEntries = true;
        this.entryService
            .getEntries(this.profileId, this.currentPage)
            .subscribe({
                next: (response) => {
                    this.entries = response.data || [];
                    this.filterEntries();
                    this.loadingEntries = false;
                    this.loading = false;
                },
                error: () => {
                    this.entries = [];
                    this.loadingEntries = false;
                    this.loading = false;
                },
            });
    }

    loadEntryCount(): void {
        this.entryService.countEntries(this.profileId).subscribe({
            next: (response) => {
                this.totalEntries = response.data;
            },
        });
    }

    filterEntries(): void {
        if (!this.searchTerm.trim()) {
            this.filteredEntries = this.entries;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredEntries = this.entries.filter((entry) =>
                entry.Text.toLowerCase().includes(term)
            );
        }
    }

    onSearchChange(): void {
        this.filterEntries();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filterEntries();
    }

    testLog(): void {
        const testMessages = [
            'INFO: Test log entry created',
            'ERROR: This is a test error message',
            'WARNING: Test warning message',
            'DEBUG: Debug test message',
            'Test log without level',
        ];
        const randomMessage =
            testMessages[Math.floor(Math.random() * testMessages.length)];

        this.entryService
            .logEntry({
                token: this.profile!.Token,
                text: randomMessage,
            })
            .subscribe({
                next: () => {
                    this.loadEntries();
                    this.loadEntryCount();
                },
            });
    }

    editProfile(): void {
        this.router.navigateByUrl(`/edit-profile/${this.profileId}`);
    }

    clearAllLogs(): void {
        if (
            confirm(
                'Are you sure you want to delete all logs for this profile? This action cannot be undone.'
            )
        ) {
            this.entryService.clearEntries(this.profileId).subscribe({
                next: () => {
                    this.entries = [];
                    this.filteredEntries = [];
                    this.totalEntries = 0;
                    this.currentPage = 1;
                },
            });
        }
    }

    nextPage(): void {
        if (this.hasNextPage()) {
            this.currentPage++;
            this.loadEntries();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadEntries();
        }
    }

    hasNextPage(): boolean {
        return this.currentPage * this.pageSize < this.totalEntries;
    }

    get totalPages(): number {
        return Math.ceil(this.totalEntries / this.pageSize);
    }

    connectWebSocket(): void {
        if (!this.profile?.Token) return;

        const wsUrl = 'ws://localhost:8000/tail/' + this.profile.Token;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected for real-time logs');
                this.reconnectAttempts = 0;
                this.wsConnected = true;
            };

            this.ws.onmessage = (event) => {
                try {
                    const newEntry: Entry = JSON.parse(event.data);

                    // Only add to current page if we're on page 1
                    if (this.currentPage === 1) {
                        // Add to the beginning of the entries array
                        this.entries.unshift(newEntry);

                        // Keep only pageSize entries
                        if (this.entries.length > this.pageSize) {
                            this.entries.pop();
                        }

                        this.filterEntries();
                    }

                    // Update total count
                    this.totalEntries++;
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.wsConnected = false;
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
        }
    }

    attemptReconnect(): void {
        if (
            this.reconnectAttempts < this.maxReconnectAttempts &&
            this.profile
        ) {
            this.reconnectAttempts++;
            console.log(
                `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
            );
            setTimeout(() => {
                this.connectWebSocket();
            }, this.reconnectDelay);
        }
    }

    disconnectWebSocket(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    ngOnDestroy(): void {
        this.disconnectWebSocket();
    }

    getLogLevelClass(text: string): string {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('error') || lowerText.includes('fail')) {
            return 'badge-error';
        } else if (
            lowerText.includes('warn') ||
            lowerText.includes('warning')
        ) {
            return 'badge-warning';
        } else if (lowerText.includes('info')) {
            return 'badge-info';
        } else if (lowerText.includes('debug')) {
            return 'badge-accent';
        }
        return 'badge-ghost';
    }

    getLogLevelIcon(text: string): any {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('error') || lowerText.includes('fail')) {
            return this.AlertCircleIcon;
        } else if (
            lowerText.includes('warn') ||
            lowerText.includes('warning')
        ) {
            return this.AlertTriangleIcon;
        } else if (lowerText.includes('debug')) {
            return this.BugIcon;
        }
        return this.InfoIcon;
    }
}
