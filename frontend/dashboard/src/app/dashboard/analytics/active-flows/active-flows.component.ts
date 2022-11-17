import { Component, OnDestroy, OnInit } from '@angular/core';
import { IActiveClientsByFlows } from 'src/app/interface/ActiveClientsByFlows.interface';
import { MetricsService } from 'src/app/services/metrics.service';

@Component({
  selector: 'app-active-flows',
  templateUrl: './active-flows.component.html',
  styleUrls: ['./active-flows.component.scss']
})
export class ActiveFlowsComponent implements OnInit, OnDestroy {

  activeFlows: IActiveClientsByFlows[];
  isLoading: boolean;
  refreshInterval: any;
  nActiveFlows: number;

  constructor(private readonly metricsService: MetricsService) {
    this.activeFlows = [];
    this.isLoading = true;
    this.nActiveFlows = 0;
  }

  ngOnInit(): void {
    this.loadActiveFlows();

    this.refreshInterval = setInterval(() => {
      this.loadActiveFlows();
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  public async loadActiveFlows() {
    this.isLoading = true;
    this.activeFlows = await this.metricsService.getActiveClientsByFlows();
    this.nActiveFlows = this.activeFlows.reduce((acc, cur) =>  {
      return acc + cur.numClients;
    }, 0)
    
    setTimeout(() => {
      this.isLoading = false;
    }, 500)
  }
}
