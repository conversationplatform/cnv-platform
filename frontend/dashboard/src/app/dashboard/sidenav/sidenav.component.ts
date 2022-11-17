import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoderedService } from 'src/app/services/nodered.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  currentFlows: string[];
  currentFlowTimer: any;

  constructor(
    private readonly noderedService: NoderedService) {
    this.currentFlows = [];
  }

  async ngOnInit(): Promise<void> {
    this.getCurrentFlows();
    this.currentFlowTimer = setInterval(() => {
      this.getCurrentFlows();
    }, 5000);
  }


  ngOnDestroy(): void {
    clearInterval(this.currentFlowTimer);
  }

  async getCurrentFlows() {
    this.currentFlows = await this.noderedService.getCurrentFlows();
  }
}
