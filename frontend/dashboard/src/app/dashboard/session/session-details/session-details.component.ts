import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClientTrack } from 'src/app/interface/ClientTrack.interface';
import { IFilter } from 'src/app/interface/filter.interface';
import { IUserSession } from 'src/app/interface/IUserSession';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit, OnDestroy {
  details: string;

  userSession: IUserSession;

  routeSub: Subscription;

  isLoading: boolean;

  interactions: IClientTrack[];

  filters: IFilter[] = [];

  constructor(
    private route: ActivatedRoute,
    private readonly sessionService: SessionService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => this.load(params['sid']));
  }


  async load(sid: string) {
    this.isLoading = true;
    this.userSession = await this.sessionService.getSession(sid);
    this.details = this.userSession.sid;
    this.filters.push({
      name: 'sid',
      operator: '==',
      value: this.userSession.sid
    })
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
