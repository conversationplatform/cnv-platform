import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClientTrack } from 'src/app/interface/ClientTrack.interface';
import { IFilter } from 'src/app/interface/filter.interface';
import { InteractionService } from 'src/app/services/interaction.service';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.scss']
})
export class TrackDetailsComponent implements OnInit, OnDestroy {
  details: string;
  
  track: IClientTrack;

  routeSub: Subscription;

  isLoading: boolean;

  filters: IFilter[] = [];


  constructor(
    private readonly trackService: TrackService,
    private readonly interactionService: InteractionService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => this.load(params['tid']));
  }

  async load(tid: string) {
    this.isLoading = true;
    this.track = await this.trackService.getTrack(tid);
    this.details = this.track.tid;
    this.filters.push({
      name: 'tid',
      operator: '==',
      value: this.track.tid
    })
    this.filters.push({
      name: 'flowId',
      operator: '==',
      value: this.track.flowId
    })
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  downloadAsCSV() {
    this.interactionService.downloadAsCSV(this.track.flowId, this.track.tid);
    
  }

}
