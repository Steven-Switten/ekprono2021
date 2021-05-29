import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { PronosComponent } from './components/pronos/pronos.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'rankings',
    component: RankingsComponent,
  },
  {
    path: 'pronos',
    component: PronosComponent,
  },
  {
    path: 'extras',
    component: ExtrasComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
