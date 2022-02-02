import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {

  constructor(
    public authService: AuthService,
  ) {}

  async signIn() {
    await this.authService.signin();
  }
}
