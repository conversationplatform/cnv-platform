import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserSession } from 'src/app/interface/IUserSession';
import { ISort } from 'src/app/interface/sort.interface';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit, OnDestroy {

  sessions: IUserSession[];
  length: number = 0;
  isLoading: boolean;
  displayedColumns: string[] = [
    'sid',
    'createDate',
    'country',
    'city',
    'browser',
    'operatingSystem'
  ];

  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 10;
  page = 0;
  take = 10;

  routeSub: Subscription;

  sort: ISort | null;

  constructor(
    private readonly sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => this.load(params))
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  async load(params: Params) {
    this.page = params['page'] || 0;
    this.take = params['take'] || 10;
    this.pageSize = params['pagesize'] || 10;
    this.getSessions();
  }

  async updateQueryParams() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { 
      page: this.page,
      take: this.take,
      sortBy: this.sort?.active,
      sortByType: this.sort?.direction
     }});
     
  }

  async getSessions() {
    this.isLoading = true;
    this.sessions = await this.sessionService.getSessions(this.page, this.take, [], this.sort);
    this.length = await this.sessionService.countSessions();
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
