import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClientTrack } from '../interface/ClientTrack.interface';
import { IFilter } from '../interface/filter.interface';
import { ISort } from '../interface/sort.interface';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) { }

  public getTracks(filters: IFilter[] , sort: ISort | null, page: number = 0, take: number = 5): Promise<IClientTrack[]> {
    let query = "";
    query += `page=${page}`;
    query += `&take=${take}`;
    query += this.filterToQueryString(filters);
    if(sort) {
      query += `&sortBy=${sort.active}&sortByType=${sort.direction}`
    }

    return this.getAsync(`${environment.apiUrl}/api/v1/client/tracks${ query ? '?' + query : ''}`)

  }

  public async getTrack(tid: string): Promise<IClientTrack> {
    return this.getAsync(`${environment.apiUrl}/api/v1/client/track?tid=${tid}`)
  }

  public countTracks(filters?: IFilter[]): Promise<number> {
    let query = "";
    query += this.filterToQueryString(filters);
    return this.getAsync(`${environment.apiUrl}/api/v1/client/count${ query ? '?' + query : ''}`)
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
