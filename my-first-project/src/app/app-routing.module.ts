import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { AngularTest } from './angular-test/angularTest.component';
import { HomeTest } from './home-test/homeTest.component';

const routes: Routes = [
            { path: '', component: AppComponent},
            { path: 'home', component: HomeTest },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
