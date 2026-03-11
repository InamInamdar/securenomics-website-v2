import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ScheduleResponse {
    total: number;
    data: any[];
}

@Injectable({
    providedIn: 'root'
})
export class LearnService {
    private baseUrl = environment.baseUrls.SDLP_EXPOSED_URL + 'exposed/schedules';

    constructor(private http: HttpClient) { }

    getSchedules(params: {
        skip: number;
        take: number;
        search?: string;
        region?: string;
        training_type?: string;
        order?: string;
        sortby?: string;
    }): Observable<ScheduleResponse> {
        let httpParams = new HttpParams()
            .set('skip', params.skip.toString())
            .set('take', params.take.toString())
            .set('order', params.order || 'asc')
            .set('sortby', params.sortby || 'start_date');

        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.region) httpParams = httpParams.set('region', params.region);
        if (params.training_type) httpParams = httpParams.set('training_type', params.training_type);

        return this.http.get<ScheduleResponse>(this.baseUrl, { params: httpParams });
    }
}
