import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICustomProperties } from '../interface/ICustomProperties';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  constructor(private http: HttpClient) { }

  public getCustomProperties(): Promise<ICustomProperties> {
    return this.getAsync(`${environment.apiUrl}/api/v1/properties/customProperties`);
  }

  public updateCustomProperties(customProperties: ICustomProperties): Promise<ICustomProperties> {
    return this.putAsync(`${environment.apiUrl}/api/v1/properties/customProperties`, customProperties);
  }

  private getAsync<T>(url: string): Promise < T > {
    return new Promise((resolve, reject) => {
      this.http.get<any>(url).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      })
    })
  }

  private putAsync<T>(url: string, data: T): Promise < T > {
    return new Promise((resolve, reject) => {
      this.http.put<any>(url, data).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      })
    })
  }
}


