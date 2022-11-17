import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClientInteraction } from '../interface/ClientInteraction.interface';
import { IFilter } from '../interface/filter.interface';
import { ISort } from '../interface/sort.interface';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor(private http: HttpClient) { }


  public getInteractions(page: number = 0, take: number = 5, flowId?: string, tid?: string, filters?: IFilter[], sort?: ISort | null): Promise<IClientInteraction[]> {
    let query = "";
    query += `page=${page}`;
    query += `&take=${take}`;
    if(flowId) {
      query += `flowId=${flowId}`;
    }
    
    if(tid) {
      query += `tid=${tid}`;
    }

    query += this.filterToQueryString(filters);

    if(sort) {
      query += `&sortBy=${sort.active}&sortByType=${sort.direction}`
    }

    return this.getAsync(`${environment.apiUrl}/api/v1/interaction/interactions${ query ? '?' + query : ''}`)
  }

  public countInteractions(flowId?: string, tid?: string, filters?: IFilter[]): Promise<number> {
    let query = "";
    if(flowId) {
      query += `flowId=${flowId}`;
    }
    
    if(tid) {
      query += `tid=${tid}`;
    }

    query += this.filterToQueryString(filters);

    return this.getAsync(`${environment.apiUrl}/api/v1/interaction/count${ query ? '?' + query : ''}`)
  }
  

  public downloadAsCSV(flowId: string, tid: string) {
    const url = `${environment.apiUrl}/api/v1/interaction/interactionsCSV?flowId=${flowId}&tid=${tid}`;
    return this.http.get(url, {
      responseType: 'blob'
    }).subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = 'archive.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    })
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
