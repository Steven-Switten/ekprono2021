import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take, tap, switchMap } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
import { Prono } from 'src/app/models/prono';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  matchToEdit = new Match();
  creatingMatch = false;
  updatingMatch = false;
  dateString?: string;
  matchId?: number;
  users: User[] = [];

  groups = {
    a: ['Italië', 'Turkije', 'Wales', 'Zwitserland'],
    b: ['België', 'Denemarken', 'Finland', 'Rusland'],
    c: ['Nederland', 'Noord-Macedonië', 'Oekraïne', 'Oostenrijk'],
    d: ['Engeland', 'Kroatië', 'Schotland', 'Tsjechië'],
    e: ['Polen', 'Spanje', 'Slowakije', 'Zweden'],
    f: ['Duitsland', 'Frankrijk', 'Hongarije', 'Portugal'],
  };
  allTeams: string[] = [];

  constructor(
    private userService: UserService,
    private adminService: MatchService,
    private navController: NavController
  ) {
    const arrays = Object.values(this.groups) as any[];
    this.allTeams = [].concat.apply([], arrays).sort();
  }

  ionViewWillEnter() {
    if (this.userService.user !== 'admin') {
      this.navController.navigateRoot('login');
      return;
    }
  }

  createNewMatch() {
    this.matchToEdit = new Match();
    this.adminService
      .getAllMatches()
      .pipe(take(1))
      .subscribe((matches) => {
        const ids = matches.map((m) => m.id);
        let newId = Math.max(...ids) + 1;
        newId = Number.isNaN(newId) ? 1 : newId;
        this.matchToEdit.id = newId;
      });
    this.creatingMatch = true;
  }

  editMatch() {
    this.updatingMatch = true;
    this.adminService
      .getAllMatches()
      .pipe(take(1))
      .subscribe((matches) => {
        this.matchToEdit =
          matches.find((m) => m.id === this.matchId) ?? new Match();
      });
  }

  saveMatch() {
    if (!this.matchToEdit?.date) {
      this.matchToEdit.date = new Date(
        `${this.dateString}Z${this.matchToEdit.time}+0200`
      );
    }
    if (this.creatingMatch) {
      this.adminService.createOrUpdateMatch(this.matchToEdit);
    }
    // TODO: save in matchResults
    else if (this.updatingMatch) {
      this.calculateUserScores();
    }

    this.creatingMatch = false;
    this.updatingMatch = false;
  }

  calculateUserScores() {
    this.userService
      .getAllUsers()
      .pipe(
        take(1),
        tap((u) => {
          this.users = u;
        }),
        switchMap(() => {
          return this.userService.getPronos(this.matchId);
        }),
        tap((pronos) => {
          this.users.forEach((u) => {
            const prono = pronos?.find((p) => p.user === u.name);
            if (prono) {
              const score = this.calculatePronoScore(prono);
              console.log('prono for ', u.name, ': ', score, 'pt');
            }
          });
        })
      )
      .subscribe();
  }

  calculatePronoScore(prono: Prono | undefined): number {
    let totalScore = 0;
    if (
      !prono ||
      !this.matchToEdit ||
      this.matchToEdit.awayScore === undefined ||
      this.matchToEdit.homeScore === undefined ||
      prono.homeScore === undefined ||
      prono.awayScore === undefined
    ) {
      console.log('iets niet in orde', this.matchToEdit, prono);
      return 0;
    }
    const matchWinner =
      this.matchToEdit.homeScore === this.matchToEdit.awayScore
        ? 'draw'
        : this.matchToEdit.homeScore > this.matchToEdit.awayScore
        ? 'home'
        : 'away';

    const pronoWinner =
      prono.homeScore === prono.awayScore
        ? 'draw'
        : prono.homeScore > prono.awayScore
        ? 'home'
        : 'away';

    if (matchWinner === pronoWinner) {
      totalScore += 5;
    }

    const matchGoalDiff =
      this.matchToEdit.homeScore - this.matchToEdit.awayScore;
    const pronoGoalDiff = prono.homeScore - prono.awayScore;
    if (matchGoalDiff === pronoGoalDiff) {
      totalScore += 2;
    }

    if (prono.homeScore === this.matchToEdit.homeScore) {
      totalScore += 1;
    }
    if (prono.awayScore === this.matchToEdit.awayScore) {
      totalScore += 1;
    }
    if (prono.firstGoalMinute === this.matchToEdit.firstGoalMinute) {
      totalScore += 2;
    } else if (
      prono.firstGoalMinute ===
        (this.matchToEdit.firstGoalMinute as number) + 1 ||
      prono.firstGoalMinute ===
        (this.matchToEdit.firstGoalMinute as number) + 2 ||
      prono.firstGoalMinute ===
        (this.matchToEdit.firstGoalMinute as number) - 1 ||
      prono.firstGoalMinute === (this.matchToEdit.firstGoalMinute as number) - 2
    ) {
      totalScore += 1;
    }

    return totalScore;
  }
}
