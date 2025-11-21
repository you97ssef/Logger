import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { NewProfileComponent } from './pages/profile/new-profile/new-profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';

import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { nonAuthGuard } from './guards/non-auth.guard';
import { LogsComponent } from './pages/logs/logs.component';
import { MeComponent } from './pages/account/me/me.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';
import { IntegrationComponent } from './pages/integration/integration.component';

export const routes: Routes = [
    {
        // CONNECTED ROUTES
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'verify', component: VerifyComponent },
            { path: 'new-profile', component: NewProfileComponent },
            { path: 'edit-profile/:id', component: EditProfileComponent },
            { path: 'logs/:id', component: LogsComponent },
            { path: 'me', component: MeComponent },
            { path: 'edit-account', component: EditAccountComponent },
            { path: 'integration', component: IntegrationComponent}
        ],
    },
    {
        // NON CONNECTED ROUTES
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [nonAuthGuard],
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
        ],
    },

    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' },
];
