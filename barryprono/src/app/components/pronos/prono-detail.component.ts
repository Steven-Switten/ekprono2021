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
          console.log('params', params);
        }),
        switchMap(() => this.matchService.getAllMatches()),
        map((matches) => {
          return matches.find((m) => m.id === this.matchId);
        }),
        tap((match) => (this.match = match))
      )
      .subscribe((r) => {
        console.log('params', r);
      });
  }

  saveProno(prono: Prono) {
    this.userService.saveProno(this.userService.user, prono).subscribe();
  }

  goBack() {
    this.navController.navigateBack('home');
  }
}
