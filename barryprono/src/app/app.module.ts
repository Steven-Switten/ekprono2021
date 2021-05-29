import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './components/login/login.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireModule } from '@angular/fire';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PronosComponent } from './components/pronos/pronos.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RankingsComponent,
    ExtrasComponent,
    HomeComponent,
    PronosComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
