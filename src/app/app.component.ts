import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  user!: firebase.default.User | null;

  constructor(
    public router: Router,
    public authService: AuthService,
    public location: Location
  ) {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
      if (this.user) {
        this.router.navigate(['fabric/' + this.user.uid]);
      }
      else{
        this.router.navigate(['signin']);
      }
    });
  }
}
