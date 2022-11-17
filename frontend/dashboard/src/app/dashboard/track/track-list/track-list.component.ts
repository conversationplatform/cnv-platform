import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClientTrack } from 'src/app/interface/ClientTrack.interface';
import { IFilter } from 'src/app/interface/filter.interface';
import { ISort } from 'src/app/interface/sort.interface';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy {

  tracks: IClientTrack[];
  length: number = 0;
  isLoading: boolean;
  displayedColumns: string[] = [
    'tid',
    'flowId',
    'date',
    //'sid',
  ];

  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  page = 0;
  take = 10;

  routeSub: Subscription;

  sort: ISort | null;

  @Input()
  filters: IFilter[] = [];

  constructor(
    private readonly trackService: TrackService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  async ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => this.load(params));
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  async load(params: Params) {
    this.page = params['page'] || 0;
    this.take = params['take'] || 10;
    this.pageSize = params['pagesize'] || 10;
    this.getTracks();
  }

  async updateQueryParams() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { 
      page: this.page,
      take: this.take,
      sortBy: this.sort?.active,
      sortByType: this.sort?.direction
     }});
     
  }

  async getTracks() {
    this.isLoading = true;
    this.tracks = await this.trackService.getTracks(this.filters, this.sort, this.page, this.take);
    this.length = await this.trackService.countTracks(this.filters);
    this.isLoading = false;
  }

  handleSort(event: any) {
    const { active, direction } = event;
    if (active && direction) {
      this.sort = {
        active,
        direction: direction.toUpperCase()
      }
    } else {
      this.sort = null;
    }
    this.updateQueryParams()
  }

  setPage(event: PageEvent) {
    this.page = event.pageIndex;
    this.take = event.pageSize;
    this.updateQueryParams()
  }

}
