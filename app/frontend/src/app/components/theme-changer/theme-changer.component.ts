import { Component, inject } from '@angular/core';
import { LucideAngularModule, MoonIcon, SunIcon } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-theme-changer',
    imports: [LucideAngularModule],
    templateUrl: './theme-changer.component.html',
    styleUrl: './theme-changer.component.css',
})
export class ThemeChangerComponent {
    readonly Sun = SunIcon;
    readonly Moon = MoonIcon;

    themeService = inject(ThemeService);

    toggleTheme(): void {
        const newTheme = this.themeService.mode() === 'dark' ? 'light' : 'dark';
        this.themeService.changeTheme(newTheme);
    }
}
