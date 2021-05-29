import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Match } from 'src/app/models/match';
import { UserService } from 'src/app/services/user.service';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-pronos',
  templateUrl: './pronos.component.html',
  styleUrls: ['./pronos.component.scss'],
})
export class PronosComponent {
  allMatches: Match[] = [];
  showFirstMatchDay = new Date() <= new Date(2021, 5, 17);
  showSecondMatchDay =
    new Date() >= new Date(2021, 5, 11) && new Date() <= new Date(2021, 5, 21);
  showThirdMatchDay =
    new Date() >= new Date(2021, 5, 16) && new Date() <= new Date(2021, 5, 24);

  showKnockOutMatches = new Date() >= new Date(2021, 5, 21);
  showQuarterFinals = new Date() >= new Date(2021, 5, 27);

  get firstMatches(): Match[] {
    return this.allMatches.filter((m) => m.id <= 12);
  }

  get secondMatches(): Match[] {
    return this.allMatches.filter((m) => m.id > 12 && m.id <= 24);
  }

  get thirdMatches(): Match[] {
    return this.allMatches.filter((m) => m.id > 24 && m.id <= 36);
  }

  get knockOutMatches(): Match[] {
    return this.allMatches.filter((m) => m.id > 36 && m.id <= 44);
  }

  get quarterFinals(): Match[] {
    return this.allMatches.filter((m) => m.id > 44 && m.id <= 48);
  }

  get semiFinals(): Match[] {
    return this.allMatches.filter((m) => m.id > 48 && m.id <= 50);
  }

  get smallFinal(): Match | undefined {
    return this.allMatches.find((m) => m.id === 51);
  }

  get final(): Match | undefined {
    return this.allMatches.find((m) => m.id === 52);
  }

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    if (!this.userService.user) {
      this.navController.navigateRoot('login');
      return;
    }

    this.matchService.getAllMatches().subscribe((matches) => {
      this.allMatches = matches;
    });
  }

  goBack() {
    this.navController.navigateBack('home');
  }

  goToMatch(match: Match) {
    this.navController.navigateForward(`pronos/detail/${match.id}`);
  }
}
