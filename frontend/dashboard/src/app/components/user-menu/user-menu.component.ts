import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  username: string;
  constructor(private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }

}
