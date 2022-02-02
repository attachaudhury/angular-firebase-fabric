import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  user!: firebase.default.User | null;
  loading = true;

  constructor(
    public router: Router,
    public authService: AuthService,
    public location: Location,
  ) {

    authService.getUser().subscribe(res => {
      
      const unauthorizedUserPaths = [ '/signin' ];
      
      this.user = res;

      this.loading = false;

      if (!this.user){
        this.router.navigate(['signin']);
      }
      else if (unauthorizedUserPaths.includes(location.path())){
        this.router.navigate(['fabric/' + this.user.uid]);
      }  

      else{
        this.router.navigate([location.path()]);
      }
    });

  }
}
