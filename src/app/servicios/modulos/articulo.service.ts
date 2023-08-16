import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiGetArticulos = this.api.getBaseUrl + "articulo/getArticulos";
  private apiCreateArticulos = this.api.getBaseUrl + "articulo/crearArticulos";
  private apiDeleteArticulo = this.api.getBaseUrl + "articulo/eliminarArticulo";

  constructor(private http: HttpClient, private api: ApiService) { }

  public getArticulos(): Observable<any> {
    return this.http.get<any>(this.apiGetArticulos, this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createArticulos(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateArticulos, data)
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public deleteArticulo(data: any): Observable<any> {
    return this.http.post<any>(this.apiDeleteArticulo, JSON.stringify(data), this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}
