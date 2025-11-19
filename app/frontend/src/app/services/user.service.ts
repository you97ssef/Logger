import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OKResponse } from '../helpers/response';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { DeleteAccountDTO, UpdateAccountDTO } from '../dtos/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    http = inject(HttpClient);

    getMe(): Observable<OKResponse<User>> {
        return this.http.get<OKResponse<User>>(`${environment.api}/me`);
    }

    updateAccount(dto: UpdateAccountDTO): Observable<OKResponse<User>> {
        return this.http.put<OKResponse<User>>(
            `${environment.api}/account`,
            dto
        );
    }

    deleteAccount(dto: DeleteAccountDTO): Observable<OKResponse<null>> {
        return this.http.delete<OKResponse<null>>(
            `${environment.api}/account`,
            {
                body: dto,
            }
        );
    }
}
