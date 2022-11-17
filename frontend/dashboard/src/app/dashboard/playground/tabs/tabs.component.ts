import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NoderedService } from 'src/app/services/nodered.service';

@Component({
  selector: 'app-playground-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  tabs: string[];

  currentFlows: string[];
  currentFlowTimer: any;

  constructor(
    private readonly noderedService: NoderedService,
    private router: Router,
    ) {
    this.currentFlows = [];
  }

  async ngOnInit() {
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

  setFlow(event: MatTabChangeEvent) {
    this.router.navigate(['/dashboard/playground/', event.tab.textLabel] )
  }

}
