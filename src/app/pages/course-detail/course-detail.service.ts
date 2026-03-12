import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CourseDetailService {

    constructor(private http: HttpClient) { }

    getSchedule(region: any, type: any): Observable<any> {
        return this.http.get(
            `${environment.baseUrls.SDLP_EXPOSED_URL}exposed/schedules?skip=0&take=1000&search=&order=asc&sortby=start_date&region=${region}&training_type=${type}`,
            {},
        );
    }

    getScheduleById(id: any): Observable<any> {
        return this.http.get(
            `${environment.baseUrls.SDLP_EXPOSED_URL}exposed/schedules/${id}`,
            {}
        )
    }

    // Check if user exists by email
    registerUser(data: any): Observable<any> {
        return this.http.post(
            `${environment.baseUrls.SDLP_EXPOSED_URL}exposed/users/registration`, data
        )
    }

    updateUser(data: any, id: number): Observable<any> {
        return this.http.post(
            `${environment.baseUrls.SDLP_EXPOSED_URL}exposed/users/registration/${id}`, data
        )
    }

    getUserByEmail(email: string): Observable<any> {
        return this.http.get(
            `${environment.baseUrls.SDLP_EXPOSED_URL}exposed/users/byemail?email=${email}`,
            {}
        )
    }
}