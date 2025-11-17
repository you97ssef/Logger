import { Injectable, WritableSignal, inject, signal } from '@angular/core';

const TOKEN_KEY = 'app_token';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    token: WritableSignal<string | null> = signal(null);

    loadToken() {
        this.token.set(localStorage.getItem(TOKEN_KEY));
    }

    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
        this.token.update(() => token);
    }

    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
        this.token.update(() => null);
    }
}
