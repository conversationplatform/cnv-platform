import { Component, Input } from '@angular/core';

import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  goback: boolean;


  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
