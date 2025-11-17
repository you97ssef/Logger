import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { messagesInterceptor } from './interceptors/messages.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { connectionInterceptor } from './core/interceptors/connection.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                connectionInterceptor,
                loadingInterceptor,
                messagesInterceptor,
            ])
        ),
    ],
};
