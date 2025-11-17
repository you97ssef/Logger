import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
    const tokenService = inject(TokenService);

    if (tokenService.token() !== null) {
        return true;
    }

    inject(Router).navigateByUrl('/login');

    return false;
};
