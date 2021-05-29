import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
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
  dateString?: string;

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
        console.log('ids', ids, newId);
        this.matchToEdit.id = newId;
      });
    this.creatingMatch = true;
  }

  saveMatch() {
    if (!this.matchToEdit?.date) {
      this.matchToEdit.date = new Date(
        `${this.dateString}Z${this.matchToEdit.time}+0200`
      );
    }
    this.adminService.createOrUpdateMatch(this.matchToEdit);
    this.creatingMatch = false;
  }
}
