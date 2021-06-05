import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take, tap, switchMap } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { calculatePronoScore } from 'src/app/utils/score-util';

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
    private dataService: DataService,
    private navController: NavController
  ) {
    const arrays = Object.values(this.groups) as any[];
    this.allTeams = [].concat.apply([], arrays).sort();
  }

  ionViewWillEnter() {
    if (this.dataService.user !== 'admin') {
      this.navController.navigateRoot('login');
      return;
    }
  }

  createNewMatch() {
    this.matchToEdit = new Match();
    this.dataService
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
    this.dataService
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
      this.dataService.createOrUpdateMatch(this.matchToEdit);
    }
    // TODO: save in matchResults ?
    else if (this.updatingMatch) {
      this.calculateUserScores();
    }

    this.creatingMatch = false;
    this.updatingMatch = false;
  }

  calculateUserScores() {
    this.dataService
      .getAllUsers()
      .pipe(
        take(1),
        tap((u) => {
          this.users = u;
        }),
        switchMap(() => {
          return this.dataService.getPronos(this.matchId);
        }),
        tap((pronos) => {
          this.users.forEach((u) => {
            const prono = pronos?.find((p) => p.user === u.name);
            if (prono) {
              const score = calculatePronoScore(prono, this.matchToEdit);
              console.log('prono for ', u.name, ': ', score, 'pt');
              // TODO: save user score ?
            }
          });
        })
      )
      .subscribe();
  }
}
