import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OKResponse } from '../helpers/response';
import { Observable } from 'rxjs';
import { NewEntryDTO } from '../dtos/entry';
import { Entry } from '../models/entry';

@Injectable({
    providedIn: 'root',
})
export class EntryService {
    http = inject(HttpClient);

    logEntry(newEntryDTO: NewEntryDTO): Observable<OKResponse<Entry>> {
        return this.http.post<OKResponse<Entry>>(
            `${environment.api}/log`,
            newEntryDTO
        );
    }

    countEntries(profileId: string): Observable<OKResponse<number>> {
        return this.http.get<OKResponse<number>>(
            `${environment.api}/profiles/${profileId}`
        );
    }

    getEntries(
        profileId: string,
        page: number
    ): Observable<OKResponse<Entry[]>> {
        return this.http.get<OKResponse<Entry[]>>(
            `${environment.api}/profiles/${profileId}/logs`,
            { params: { page: page.toString() } }
        );
    }

    clearEntries(profileId: string): Observable<OKResponse<null>> {
        return this.http.delete<OKResponse<null>>(
            `${environment.api}/profiles/${profileId}/logs`
        );
    }

    countUserEntries(profileId: string): Observable<OKResponse<number>> {
        return this.http.get<OKResponse<number>>(
            `${environment.api}/admin-profiles/${profileId}`
        );
    }

    getUserEntries(
        profileId: string,
        page: number
    ): Observable<OKResponse<Entry[]>> {
        return this.http.get<OKResponse<Entry[]>>(
            `${environment.api}/admin-profiles/${profileId}/logs`,
            { params: { page: page.toString() } }
        );
    }
}
