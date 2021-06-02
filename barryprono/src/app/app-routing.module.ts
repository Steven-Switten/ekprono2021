import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { PronosComponent } from './components/pronos/pronos.component';
import { AdminComponent } from './components/admin/admin.component';
import { PronoDetailComponent } from './components/pronos/prono-detail.component';
import { MetaComponent } from './components/meta/meta.component';
import { RulesComponent } from './components/rules/rules.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
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
    path: 'metas',
    component: MetaComponent,
  },
  {
    path: 'rules',
    component: RulesComponent,
  },
  {
    path: 'pronos/detail/:id',
    component: PronoDetailComponent,
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
