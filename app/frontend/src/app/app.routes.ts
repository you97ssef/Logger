import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { nonAuthGuard } from './guards/non-auth.guard';

export const routes: Routes = [
    {
        // CONNECTED ROUTES
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: '', component: HomeComponent },
        ],
    },
    {
        // NON CONNECTED ROUTES
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [nonAuthGuard],
        children: [
            { path: 'login', component: LoginComponent }
        ],
    },

    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
];
