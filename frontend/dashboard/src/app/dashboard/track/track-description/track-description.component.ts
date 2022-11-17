import { Component, Input, OnInit } from '@angular/core';
import { IClientTrack } from 'src/app/interface/ClientTrack.interface';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-track-description',
  templateUrl: './track-description.component.html',
  styleUrls: ['./track-description.component.scss']
})
export class TrackDescriptionComponent implements OnInit {

  @Input()
  track: IClientTrack;

  @Input()
  tid: string;

  constructor(
    private readonly trackService: TrackService
  ) { }

  async ngOnInit() {
    if(!this.track && this.tid) {
      this.track = await this.trackService.getTrack(this.tid);
    }
  }

}
