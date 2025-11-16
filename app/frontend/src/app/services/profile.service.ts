import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OKResponse } from '../helpers/response';
import { Observable } from 'rxjs';
import { NewProfileDTO, UpdateProfileDTO } from '../dtos/profile';
import { Profile } from '../models/profile';



@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    http = inject(HttpClient);

    getProfiles(): Observable<OKResponse<Profile[]>> {
        return this.http.get<OKResponse<Profile[]>>(
            `${environment.api}/profiles`
        );
    }

    createProfile(
        newProfileDTO: NewProfileDTO
    ): Observable<OKResponse<Profile>> {
        return this.http.post<OKResponse<Profile>>(
            `${environment.api}/profiles`,
            newProfileDTO
        );
    }

    updateProfile(
        updateProfileDTO: UpdateProfileDTO
    ): Observable<OKResponse<Profile>> {
        return this.http.put<OKResponse<Profile>>(
            `${environment.api}/profiles`,
            updateProfileDTO
        );
    }

    deleteProfile(id: string): Observable<OKResponse<null>> {
        return this.http.delete<OKResponse<null>>(
            `${environment.api}/profiles/${id}`
        );
    }

    getUserProfiles(userId: string): Observable<OKResponse<Profile[]>> {
        return this.http.get<OKResponse<Profile[]>>(
            `${environment.api}/users/${userId}/profiles`
        );
    }
}
