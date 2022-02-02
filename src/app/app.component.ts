import { Component } from '@angular/core';
import { PageService } from '././services/page.service';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user!: firebase.default.User | null;
  loading = true;

  constructor(
    public router: Router,
    public pageService: PageService,
    public authService: AuthService,
    public location: Location,
  ) {

    authService.getUser().subscribe(res => {
      
      const unauthorizedUserPaths = [ '/signin' ];
      
      this.user = res;

      this.loading = false;

      if (!this.user){
        pageService.navigateRoute('signin');
        this.router.navigate(['signin']);
      }
      else if (unauthorizedUserPaths.includes(location.path())){
        //pageService.navigateRoute('fabric/' + this.user.uid);
        this.router.navigate(['fabric/' + this.user.uid]);
      }  

      else{
        //pageService.navigateRoute(location.path());
        this.router.navigate([location.path()]);
      }
    });

  }
}
