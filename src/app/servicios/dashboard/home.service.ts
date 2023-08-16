import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiGetStats = this.api.getBaseUrl + "home/getStats";

  constructor(private http: HttpClient, private api: ApiService) { }

  public getStats(): Observable<any> {
    return this.http.get<any>(this.apiGetStats, this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}
