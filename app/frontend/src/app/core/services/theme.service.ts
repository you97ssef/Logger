import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private static KEY = 'app_theme';
    private static ATTRIBUTE = 'data-theme';
    mode: WritableSignal<'dark' | 'light'> = signal(this.getTheme());

    private getTheme(): 'dark' | 'light' {
        return localStorage.getItem(ThemeService.KEY) == 'dark'
            ? 'dark'
            : 'light';
    }

    private setTheme(theme: 'dark' | 'light'): void {
        document.documentElement.setAttribute(ThemeService.ATTRIBUTE, theme);

        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);

        this.mode.set(theme);
    }

    changeTheme(theme: 'dark' | 'light'): void {
        localStorage.setItem(ThemeService.KEY, theme);
        this.setTheme(theme);
    }

    loadTheme() {
        const theme = this.getTheme();
        if (theme) {
            this.setTheme(theme);
        }
    }
}
