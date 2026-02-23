import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CourseDetailService {
    private baseUrl = 'https://snlp-backend.comanage360.com/exposed/schedules';

    constructor(private http: HttpClient) { }

    getSchedule(id: string | number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }
}
