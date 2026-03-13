import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()

export class PovRequestService {

  constructor(private http: HttpClient) { }

  getPovData(data: any): Observable<any> {
    return this.http.post(`${environment.baseUrls.REGISTRATION_URL}pov-request`, data);
  }

}