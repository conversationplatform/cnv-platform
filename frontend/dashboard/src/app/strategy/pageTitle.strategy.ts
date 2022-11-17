import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
    constructor(private readonly title: Title) {
      super();
    }
  
    override updateTitle(routerState: RouterStateSnapshot) {
      const title = this.buildTitle(routerState);
      if (title !== undefined) {
        this.title.setTitle(`${environment.appTitle} | ${title}`);
      } else {
        this.title.setTitle(environment.appTitle);
      }
    }
  }