import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { getAvatar } from 'src/app/utils/avatar-util';
import { calculatePronoScore } from 'src/app/utils/score-util';
import { Match } from '../../models/match';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent {
  usersRanked: User[] = [];
  get isDeadLinePast(): boolean {
    return new Date(2021, 5, 11, 21, 0, 0) <= new Date();
  }
  extras: Extras[] = [];

  constructor(
    private dataService: DataService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.dataService
      .getAllUsers()
      .pipe(
        map((usrs) => {
          const users = usrs.map((u) => {
            const ucopy = { ...u };
            ucopy.score = u.score ?? 0;
            return ucopy;
          });
          return users.filter((u) => u.name !== 'admin');
        }),
        tap((usr) => (this.usersRanked = usr))
      )
      .subscribe(() => {
        this.calculateScores();
      });

    this.dataService
      .getAllExtras()
      .subscribe((extras) => (this.extras = extras));
  }

  goBack() {
    this.navController.navigateBack('home');
  }

  getAvatar(user: User): string {
    return getAvatar(user.name);
  }

  isKneusje(user: User): boolean {
    if (this.usersRanked.every((u) => u.score === 0)) {
      return false;
    }
    return this.usersRanked.indexOf(user) === this.usersRanked.length - 1;
  }

  getCountry(user: User): string | undefined {
    const country = this.extras
      .find((e) => e.user === user.name)
      ?.winnerAll?.toLowerCase();

    if (country) {
      return `assets/flags/${country}.png`;
    }
    return ``;
  }

  goToUserDetail(user: User) {}

  calculateScores() {
    let matches: Match[] = [];
    this.dataService
      .getAllMatches()
      .pipe(
        tap((m) => (matches = m)),
        switchMap(() => {
          return this.dataService.getAllPronos();
        }),
        tap((pronos) => {
          this.usersRanked.forEach((u) => {
            let userScore = 0;
            matches.forEach((m) => {
              const prono = pronos?.find((p) => p.user === u.name);
              if (prono) {
                const score = calculatePronoScore(prono, m);
                // console.log(                  'prono for match',                  m.id,                  ' user: ',                  u.name,                  ': ',                  score,                  'pt'                );
                userScore += score;
              }
            });
            u.score = userScore;
            // TODO: extras
          });
        }),
        tap(() => {
          this.usersRanked = this.usersRanked.sort((m1, m2) =>
            m1.score === m2.score ? 0 : m2.score < m1.score ? -1 : 1
          );
        })
      )
      .subscribe();
  }
}
