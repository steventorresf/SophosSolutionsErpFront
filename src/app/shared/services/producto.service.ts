import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators'

import { environment } from '../../../environments/environment';


@Injectable()
export class ProductosService {

    constructor(private http: HttpClient) { }

    public Create(params: any): Observable<any> {
      return this.http.post(`${environment.apiURI}Producto/`, params)
      .pipe(
          retry(2), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
      );
    }

    public Delete(id: number): Observable<any> {
      return this.http.delete(`${environment.apiURI}Producto/${id}`)
      .pipe(
          retry(2), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
      );
    }

    public getAll(): Observable<any> {
      return this.http.get<any>(`${environment.apiURI}Producto/`)
      .pipe(
          retry(2), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
      );
  }

  public Update(params: any): Observable<any> {
    return this.http.put(`${environment.apiURI}Producto/`, params)
    .pipe(
        retry(2), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
    );
  }

  // Errors
  private handleError(error: HttpErrorResponse) {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      // Return an observable with a user-facing error message.
      return throwError(
        'Something bad happened; please try again later.');
  }

}
