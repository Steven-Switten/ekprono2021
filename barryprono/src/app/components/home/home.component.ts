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
      return;
    }
    this.name = this.userService.user;
  }

  goToRankings() {
    this.navController.navigateForward('rankings');
  }

  goToPronos() {
    this.navController.navigateForward('pronos');
  }

  goToExtras() {
    this.navController.navigateForward('extras');
  }

  goToMetas() {
    this.navController.navigateForward('metas');
  }

  goToRules() {
    this.navController.navigateForward('rules');
  }
}
