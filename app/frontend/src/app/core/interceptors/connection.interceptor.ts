import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const connectionInterceptor: HttpInterceptorFn = (req, next) => {
    const service = inject(TokenService);

    if (service.token()) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${service.token()}`,
            },
        });
    }

    return next(req);
};
