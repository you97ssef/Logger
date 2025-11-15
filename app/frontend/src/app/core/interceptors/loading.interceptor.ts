import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const service = inject(LoadingService);
    service.addLoader();

    return next(req).pipe(
        finalize(() => {
            service.removeLoader();
        })
    );
};
