import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  name?: string;
  constructor(
    private userService: UserService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    if (!this.userService.user) {
      this.navController.navigateRoot('login');
    }
  }
}
