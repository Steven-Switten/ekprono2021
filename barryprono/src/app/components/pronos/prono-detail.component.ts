import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take, switchMap, mapTo, tap, map } from 'rxjs/operators';
import { Prono } from 'src/app/models/prono';
import { MatchService } from 'src/app/services/match.service';
import { UserService } from 'src/app/services/user.service';
import { Match } from '../../models/match';

@Component({
  selector: 'app-prono-detail',
  templateUrl: './prono-detail.component.html',
  styleUrls: ['./prono-detail.component.scss'],
})
export class PronoDetailComponent {
  match?: Match;
  matchId?: number;
  prono: Prono = new Prono();

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
    private userService: UserService,
    private matchService: MatchService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    if (!this.userService.user) {
      this.navController.navigateRoot('login');
      return;
    }

    this.route.params
      .pipe(
        take(1),
        tap((params) => {
          this.matchId = +params.id;
        }),
        switchMap(() => this.matchService.getAllMatches()),
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
          this.userService.getProno(this.userService.user, this.matchId)
        ),
        tap((prono) => {
          if (!prono) {
            this.prono = new Prono();
            this.prono.matchId = this.matchId;
            this.prono.user = this.userService.user;
          } else {
            this.prono = prono;
          }
        })
      )
      .subscribe(() => {});
  }

  saveProno() {
    this.userService.saveProno(this.userService.user, this.prono).subscribe();
  }

  goBack() {
    if (this.isPronoValid) {
      this.saveProno();
    }
    this.navController.navigateBack('pronos');
  }
}
