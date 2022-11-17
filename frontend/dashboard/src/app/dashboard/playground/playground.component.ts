import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  routeSub: Subscription;
  flowId: string;
  safeUrl: any = null;
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe( (params) => {
      this.safeUrl = null;
      setTimeout(() => {
        this.getURL(params['id'])
        
      }, 500);
  })
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getURL(flowId:string ) {
    const url = environment.production ? `/app/#${flowId}`:`http://localhost:1234/#${flowId}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
