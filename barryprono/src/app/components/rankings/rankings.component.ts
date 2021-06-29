import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { getAvatar } from 'src/app/utils/avatar-util';
import {
  calculateGroupWinnerScores,
  calculatePronoScore,
} from 'src/app/utils/score-util';
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
  luckyGoalPoints = false;
  showCorrectMatches = false;
  winnerOnly = false;

  constructor(
    private dataService: DataService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.luckyGoalPoints = false;
    this.showCorrectMatches = false;
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

  goToUserDetail(user: string) {
    if (user.includes('BeatingBumBeirt')) {
      user = 'BeatingBumBeirt';
    }
    this.navController.navigateForward(`users/${user}`);
  }

  calculateScores(
    luckyGoalOnly: boolean = false,
    exactMatches: boolean = false,
    winnerOnly: boolean = false
  ) {
    let matches: Match[] = [];
    this.dataService
      .getAllMatches()
      .pipe(
        tap((m) => (matches = m.filter((m) => m.awayScore !== undefined))),
        switchMap(() => {
          return this.dataService.getAllPronos();
        }),
        tap((pronos) => {
          this.usersRanked.forEach((u) => {
            let userScore = 0;

            const userPronos = pronos?.filter((p) => p.user === u.name);
            userPronos.forEach((prono) => {
              if (prono) {
                const score = calculatePronoScore(
                  prono,
                  matches.find((m) => m.id === prono.matchId),
                  luckyGoalOnly,
                  !exactMatches,
                  winnerOnly
                );
                if (exactMatches && !winnerOnly) {
                  if (score === 9) {
                    userScore += 1;
                  }
                } else {
                  userScore += score;
                }
              }
            });

            u.score = userScore;
            if (winnerOnly) {
              u.score = u.score / 5;
            }

            if (
              !this.luckyGoalPoints &&
              !this.showCorrectMatches &&
              !this.winnerOnly
            ) {
              const extrasScore = calculateGroupWinnerScores(
                this.extras.find((e) => e.user === u.name) as Extras,
                this.extras.find((e) => e.user === 'admin') as Extras
              );
              u.score += extrasScore;
            }
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

  toggleLuckyGoalPoints() {
    this.luckyGoalPoints = !this.luckyGoalPoints;
    this.calculateScores(this.luckyGoalPoints, false, false);
  }

  toggleShowMatchesCorrect() {
    this.showCorrectMatches = !this.showCorrectMatches;
    this.calculateScores(false, true, false);
  }

  toggleShowWinnerOnly() {
    this.winnerOnly = !this.winnerOnly;
    this.calculateScores(false, true, true);
  }

  showRankings() {
    this.showCorrectMatches = false;
    this.luckyGoalPoints = false;
    this.winnerOnly = false;
    this.calculateScores(false, false, false);
  }
}
