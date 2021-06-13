import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { Prono } from 'src/app/models/prono';
import { DataService } from 'src/app/services/data.service';
import { getAvatar } from 'src/app/utils/avatar-util';
import { Match } from '../../models/match';
import { calculatePronoScore } from '../../utils/score-util';
import { User } from '../../models/user';
import { sortObjects } from '../../utils/sort.util';

@Component({
  selector: 'app-prono-detail',
  templateUrl: './prono-detail.component.html',
  styleUrls: ['./prono-detail.component.scss'],
})
export class PronoDetailComponent {
  match?: Match;
  matchId?: number;
  prono: Prono = new Prono();
  otherPronos: Prono[] = [];
  pronoScore = 0;
  usersNotDone: string[] = [];
  allUsers: User[] = [];

  get isPronoValid(): boolean {
    return (
      this.prono.homeScore !== undefined &&
      this.prono.awayScore !== undefined &&
      this.prono.firstGoalMinute !== undefined
    );
  }

  get hasDeadlinePassed(): boolean {
    return !!this.match?.date && this.match.date < new Date();
  }

  constructor(
    private dataService: DataService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    if (!this.dataService.user) {
      this.navController.navigateRoot('login');
      return;
    }

    this.route.params
      .pipe(
        take(1),
        tap((params) => {
          this.matchId = +params.id;
        }),
        switchMap(() => this.dataService.getAllMatches()),
        map((matches) => {
          return matches.find((m) => m.id === this.matchId);
        }),
        tap((match) => {
          if (!match?.id) {
            this.navController.navigateBack('pronos');
          }
          this.match = match;
        }),
        switchMap(() =>
          this.dataService.getProno(this.dataService.user, this.matchId)
        ),
        tap((prono) => {
          if (!prono) {
            this.prono = new Prono();
            this.prono.matchId = this.matchId;
            this.prono.user = this.dataService.user;
          } else {
            this.prono = prono;
          }
        }),

        tap(() => {
          if (this.hasDeadlinePassed) {
            this.pronoScore = calculatePronoScore(this.prono, this.match);
          }
        }),
        switchMap(() => this.dataService.getAllUsers()),
        tap((users) => {
          this.allUsers = users.filter(
            (u: User) => u.name !== 'admin' && u.name !== this.dataService.user
          );
        })
      )
      .subscribe(() => {
        this.dataService.getPronos(this.matchId).subscribe((p) => {
          this.otherPronos = p.filter((pr) => pr.user !== this.prono.user);
          this.allUsers.forEach((u) => {
            if (
              !this.otherPronos.find(
                (o) => o.user === u.name && o.homeScore !== undefined
              )
            ) {
              this.usersNotDone.push(u.name);
            }
          });
          this.otherPronos.forEach((p) => {
            if (this.match?.awayScore !== undefined) {
              p.userScore = this.getUserScore(p);
            }
          });
          this.otherPronos = sortObjects(this.otherPronos, ['userScore'], -1);
        });
      });
  }

  saveProno() {
    this.dataService.saveProno(this.dataService.user, this.prono).subscribe();
  }

  goBack() {
    if (this.isPronoValid) {
      this.saveProno();
    }
    this.navController.navigateBack('pronos');
  }

  getCountryAvatar(country: string) {
    return `assets/flags/${country.toLowerCase()}.png`;
  }

  getAvatar(user: string): string {
    return getAvatar(user);
  }

  getUserScore(prono: Prono): number {
    return calculatePronoScore(prono, this.match);
  }
}
