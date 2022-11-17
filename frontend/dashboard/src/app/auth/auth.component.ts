import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginFormGroup: UntypedFormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private readonly authService: AuthService) {

  }

  ngOnInit(): void {
    if(this.authService.getApiToken()) {
      this.router.navigate(['/']);
    }
    this.loginFormGroup = new UntypedFormGroup({
      user: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
    });
  }

  async doLogin() {
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    const user = this.loginFormGroup.value.user;
    const password = this.loginFormGroup.value.password;

    this.authService.login(user, password)
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err, 'Dismiss')
      }
    })
  }

}
