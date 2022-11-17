import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IActiveClientsByFlows } from '../interface/ActiveClientsByFlows.interface';
import { IAggregatedSessionByBrowser } from '../interface/aggregatedSessionByBrowser.interface';
import { IAggregatedSessionByLocation } from '../interface/aggregatedSessionByLocation.interface';
import { IAggregatedSessionByOS } from '../interface/aggregatedSessionByOS.interface';
import { INormalizedMetricsFlowByHour } from '../interface/normalizedMetricsFlowByHour.interface';
import { IClientTrack } from '../interface/ClientTrack.interface';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(private http: HttpClient) { }

  public getActiveClients(): Promise<IClientTrack[]> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/activeClients`)
  }

  public getActiveClientsByFlows(): Promise<IActiveClientsByFlows[]> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/activeClientsByFlows`)
  }

  public getAggregatedSessionsByLocation(startDate?: Date, endDate?: Date): Promise<IAggregatedSessionByLocation[]> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/getAggregatedSessionsByLocation${ this.getQueryString(startDate, endDate) }`)
  }

  public getAggregatedSessionsByBrowser(startDate?: Date, endDate?: Date): Promise<IAggregatedSessionByBrowser[]> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/getAggregatedSessionsByBrowser${ this.getQueryString(startDate, endDate) }`)
  }

  public getAggregatedSessionsByOS(startDate?: Date, endDate?: Date): Promise<IAggregatedSessionByOS[]> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/getAggregatedSessionsByOS${ this.getQueryString(startDate, endDate) }`)
  }

  public getNormalizedMetricsFlowByHour(startDate?: Date, endDate?: Date): Promise<INormalizedMetricsFlowByHour> {
    return this.getAsync(`${environment.apiUrl}/api/v1/metrics/getNormalizedMetricsFlowByHour${ this.getQueryString(startDate, endDate) }`)
  }

  private getQueryString(startDate?: Date, endDate?: Date): string {
    if(startDate && endDate) {
      return `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    }
    return '';
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
