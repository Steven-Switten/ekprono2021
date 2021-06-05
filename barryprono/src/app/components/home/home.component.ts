import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  name?: string;
  constructor(
    private dataService: DataService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    if (!this.dataService.user) {
      this.navController.navigateRoot('login');
      return;
    }
    this.name = this.dataService.user;
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
