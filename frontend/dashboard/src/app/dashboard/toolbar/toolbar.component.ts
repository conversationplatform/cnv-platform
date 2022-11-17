import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output()
  toggle = new EventEmitter<any>();

  appTitle: string;

  ngOnInit(): void {
    this.appTitle = environment.appTitle;
  }

  toggleNavBar() {
    this.toggle.emit({});
  }

}
