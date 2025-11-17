import { computed, inject, Injectable, Signal } from '@angular/core';
import { LoginDTO, RegisterDTO, ResetPasswordDTO } from '../dtos/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OKResponse } from '../helpers/response';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../core/services/token.service';
import { TokenUser } from '../helpers/token-user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    tokenService = inject(TokenService);

    me: Signal<TokenUser | null> = computed(() => {
        if (this.tokenService.token() === null) {
            return null;
        }
        const payload = this.tokenService.token()!.split('.')[1];
        const decoded = atob(payload);

        return JSON.parse(decoded) as TokenUser;
    });

    tokenExpiringInLessThan24Hours(): boolean {
        const expiration = this.me()?.expiration;
        if (!expiration) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        const twentyFourHours = 24 * 60 * 60;

        return expiration - now < twentyFourHours;
    }

    logout(): void {
        this.tokenService.removeToken();
    }

    // Auth API calls
    login(loginDTO: LoginDTO): Observable<OKResponse<string>> {
        return this.http
            .post<OKResponse<string>>(`${environment.api}/login`, loginDTO)
            .pipe(
                tap((response) => {
                    this.tokenService.setToken(response.data);
                })
            );
    }

    register(registerDTO: RegisterDTO): Observable<OKResponse<string>> {
        return this.http
            .post<OKResponse<string>>(
                `${environment.api}/register`,
                registerDTO
            )
            .pipe(
                tap((response) => {
                    this.tokenService.setToken(response.data);
                })
            );
    }

    resendVerification(email: string): Observable<OKResponse<null>> {
        return this.http.get<OKResponse<null>>(
            `${environment.api}/resend-verification`,
            { params: { email } }
        );
    }

    verifyEmail(token: string): Observable<OKResponse<string>> {
        return this.http
            .get<OKResponse<string>>(`${environment.api}/verify`, {
                params: { token },
            })
            .pipe(
                tap((response) => {
                    this.tokenService.setToken(response.data);
                })
            );
    }

    forgotPassword(email: string): Observable<OKResponse<null>> {
        return this.http.get<OKResponse<null>>(
            `${environment.api}/forgot-password`,
            { params: { email } }
        );
    }

    resetPassword(
        resetPasswordDTO: ResetPasswordDTO
    ): Observable<OKResponse<null>> {
        return this.http.post<OKResponse<null>>(
            `${environment.api}/reset-password`,
            resetPasswordDTO
        );
    }

    refreshToken(): Observable<OKResponse<string>> {
        return this.http
            .get<OKResponse<string>>(`${environment.api}/refresh-token`)
            .pipe(
                tap((response) => {
                    this.tokenService.setToken(response.data);
                })
            );
    }
}
