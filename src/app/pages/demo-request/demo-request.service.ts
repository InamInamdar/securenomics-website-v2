import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()

export class DemoRequestService {
  constructor(private http: HttpClient) { }

  getDemoData(data: any): Observable<any> {
    return this.http.post(`${environment.baseUrls.REGISTRATION_URL}demo-request`, data);
  }
}