import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FabricCanvasComponent } from './components/fabric/fabriccanvas.component';
import { SigninComponent } from './components/signin/signin.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'fabric/:id', component: FabricCanvasComponent },
  { path: '**', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
