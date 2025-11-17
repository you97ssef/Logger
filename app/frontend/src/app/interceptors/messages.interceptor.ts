import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ToastService } from '../core/services/toast.service';

export const messagesInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
        tap((response: any) => {
            if (response?.body?.message) {
                toastService.show({
                    type: 'success',
                    message: response.body.message,
                });
            }
        }),

        catchError((error) => {
            if (error?.error?.message) {
                toastService.show({
                    type: 'error',
                    message: error.error.message,
                });
            } else {
                toastService.show({
                    type: 'error',
                    message: 'An unexpected error occurred.',
                });
            }

            return throwError(() => error);
        })
    );
};
