import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
const routes: Routes = [
  { path:'main',component: HomeComponent},
];

export const HomeRoutes = RouterModule.forChild(routes);
