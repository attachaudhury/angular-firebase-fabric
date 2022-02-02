import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FabricCanvasComponent } from './components/fabric/fabriccanvas.component';
import { LoginComponent } from './components/signin/login.component';

const routes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'fabric/:id', component: FabricCanvasComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
