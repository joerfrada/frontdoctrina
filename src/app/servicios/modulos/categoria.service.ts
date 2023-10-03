import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiGetCategorias = this.api.getBaseUrl + "categoria/getCategorias";
  private apiCreateCategorias = this.api.getBaseUrl + "categoria/crearCategorias";
  private apiUpdateCategorias = this.api.getBaseUrl + "categoria/actualizarCategorias";
  private apiDeleteCategoria = this.api.getBaseUrl + "categoria/eliminarCategoria";

  constructor(private http: HttpClient, private api: ApiService) { }

  public getCategorias(): Observable<any> {
    return this.http.get<any>(this.apiGetCategorias, this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createCategorias(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateCategorias, JSON.stringify(data), this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public updateCategorias(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpdateCategorias, JSON.stringify(data), this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public deleteCategoria(data: any): Observable<any> {
    return this.http.post<any>(this.apiDeleteCategoria, JSON.stringify(data), this.api.getHttpOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}
