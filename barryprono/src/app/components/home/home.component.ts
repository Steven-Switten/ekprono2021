import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Extras } from '../../models/extras';
import { Metas } from '../../models/metas';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  name?: string;
  userExtras?: Extras;
  userMetas?: Metas;

  get extrasMissing(): boolean {
    if (!this.userExtras) {
      return false;
    }
    return (
      !this.userExtras.winnerA ||
      !this.userExtras.winnerAll ||
      !this.userExtras.winnerB ||
      !this.userExtras.winnerC ||
      !this.userExtras.winnerD ||
      !this.userExtras.winnerE ||
      !this.userExtras.winnerF ||
      !this.userExtras.loserA ||
      !this.userExtras.loserB ||
      !this.userExtras.loserC ||
      !this.userExtras.loserD ||
      !this.userExtras.loserF ||
      !this.userExtras.secondPlace ||
      !this.userExtras.thirdPlace ||
      !this.userExtras.fourthPlace ||
      !this.userExtras.loserE
    );
  }

  get metasMissing(): boolean {
    if (!this.userMetas) {
      return false;
    }
    return (
      !this.userMetas.winner ||
      !this.userMetas.bumOrSwiggy ||
      !this.userMetas.loser ||
      !this.userMetas.lucky ||
      !this.userMetas.unlucky
    );
  }

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
    this.dataService
      .loadExtras(this.name)
      .subscribe((e) => (this.userExtras = e));

    this.dataService
      .loadMetas(this.name)
      .subscribe((e) => (this.userMetas = e));
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
