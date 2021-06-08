import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { interval } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
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
  matches: Match[] = [];
  timeUntilNextMatch: string = '';

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

    this.dataService.getAllMatches().subscribe((e) => {
      this.matches = e;
      // TODO: interval 1000
      interval(1000)
        .pipe(
          startWith(0),
          tap(() => {
            this.setTimeUntilNextMatch();
          })
        )
        .subscribe();
    });
  }

  private setTimeUntilNextMatch() {
    const now = new Date();
    const nextMatchDate =
      this.matches
        .map((m) => m.date?.valueOf())
        .filter((m) => m && m > now.valueOf())
        .sort()[0] ?? new Date().valueOf();

    // get total seconds between the times
    let delta = Math.abs(nextMatchDate - now.valueOf()) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = Math.floor(delta);
    this.timeUntilNextMatch = `${days} ${
      days === 1 ? 'dag' : 'dagen'
    }, ${hours} ${hours === 1 ? 'uur' : 'uren'}, ${minutes} ${
      minutes === 1 ? 'minuut' : 'minuten'
    }, ${seconds} ${seconds === 1 ? 'seconde' : 'seconden'}`;
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
