import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFilter } from '../interface/filter.interface';
import { IUserSession } from '../interface/IUserSession';
import { ISort } from '../interface/sort.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }
  

  public getSessions(page: number = 0, take: number = 5, filters: IFilter[] = [], sort?: ISort | null): Promise<IUserSession[]> {
    let query = "";
    query += `page=${page}`;
    query += `&take=${take}`;
    query += this.filterToQueryString(filters);
    if(sort) {
      query += `&sortBy=${sort.active}&sortByType=${sort.direction}`
    }

    return this.getAsync(`${environment.apiUrl}/api/v1/session/sessions${ query ? '?' + query : ''}`)

  }
  public countSessions(filters: IFilter[] = []): Promise<number> {
    let query = "";
    query += this.filterToQueryString(filters);
    return this.getAsync(`${environment.apiUrl}/api/v1/session/count${ query ? '?' + query : ''}`)
  }

  public getSession(sessionId: string): Promise<IUserSession> {
    return this.getAsync(`${environment.apiUrl}/api/v1/session/session?sessionId=${sessionId}`)
  }

  private filterToQueryString(filters?: IFilter[]): string {
    let query = '';
    filters?.forEach(filter => {
      if(filter.operator == '==') {
        query += `&${filter.name}=${filter.value}`;
      } else {
        query += `&${filter.name}=${filter.value}&${filter.name}Operator=${filter.operator}`;
      }
    })
    return query;
  }

  private getAsync<T>(url: string): Promise<T> {
    return new Promise( (resolve, reject) => {
      this.http.get<any>(url).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      })
    })
  }
}
