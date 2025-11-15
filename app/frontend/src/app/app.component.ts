import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './core/components/modal/modal.component';
import { LoadingComponent } from './core/components/loading/loading.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { ThemeService } from './core/services/theme.service';
import { TokenService } from './core/services/token.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ModalComponent, LoadingComponent, ToastComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    themeService = inject(ThemeService);
    tokenService = inject(TokenService);

    ngOnInit(): void {
        this.themeService.loadTheme();
        this.tokenService.loadToken();
    }
}
