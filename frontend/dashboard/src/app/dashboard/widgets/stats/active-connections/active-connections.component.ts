import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/services/metrics.service';
@Component({
  selector: 'app-active-connections',
  templateUrl: './active-connections.component.html',
  styleUrls: ['./active-connections.component.scss']
})
export class ActiveConnectionsComponent implements OnInit, OnDestroy {

  activeConnections: number;
  isLoading: boolean;
  refreshInterval: any;

  constructor(private readonly metricsService: MetricsService) {
    this.activeConnections = 0;
    this.isLoading = true;
  }
  

  ngOnInit(): void {
    this.loadActiveConections();
    
    this.refreshInterval = setInterval(() => {
      this.loadActiveConections();
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }


  public async loadActiveConections() {
    this.isLoading = true;
    this.activeConnections = (await this.metricsService.getActiveClients()).length
    setTimeout(() => {
      this.isLoading = false;
    }, 500)
  }

}
