import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nodered',
  templateUrl: './nodered.component.html',
  styleUrls: ['./nodered.component.scss']
})
export class NoderedComponent implements OnInit {
  safeUrl: any = null;
  constructor(
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const url = environment.production && location.host.indexOf('localhost') == -1 ? '/red/' : 'http://localhost:1880/red/';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
