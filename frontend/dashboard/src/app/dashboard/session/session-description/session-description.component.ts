import { Component, Input, OnInit } from '@angular/core';
import { IUserSession } from 'src/app/interface/IUserSession';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-description',
  templateUrl: './session-description.component.html',
  styleUrls: ['./session-description.component.scss']
})
export class SessionDescriptionComponent implements OnInit {

  @Input()
  userSession: IUserSession;
  
  @Input()
  sid: string;

  constructor(private readonly sessionService: SessionService) { }

  async ngOnInit() {
    if(!this.userSession && this.sid) {
      this.userSession = await this.sessionService.getSession(this.sid);
    }
  }

}
