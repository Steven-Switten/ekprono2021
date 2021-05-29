import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss'],
})
export class ExtrasComponent {
  groups = {
    a: ['Italië', 'Turkije', 'Wales', 'Zwitserland'],
    b: ['België', 'Denemarken', 'Finland', 'Rusland'],
    c: ['Nederland', 'Noord-Macedonië', 'Oekraïne', 'Oostenrijk'],
    d: ['Engeland', 'Kroatië', 'Schotland', 'Tsjechië'],
    e: ['Polen', 'Spanje', 'Slowakije', 'Zweden'],
    f: ['Duitsland', 'Frankrijk', 'Hongarije', 'Portugal'],
  };
  allTeams: string[] = [];

  extras = new Extras('');

  get canEdit(): boolean {
    return new Date(2021, 5, 11, 21, 0, 0) > new Date();
  }

  constructor(
    private userService: UserService,
    private navController: NavController
  ) {
    const arrays = Object.values(this.groups) as any[];
    this.allTeams = [].concat.apply([], arrays).sort();
  }

  ionViewWillEnter() {
    if (!this.userService.user) {
      this.navController.navigateRoot('login');
      return;
    }
    this.userService
      .loadExtras(this.userService.user)
      .pipe(take(1))
      .subscribe((extras) => {
        this.extras = extras ?? new Extras(this.userService.user as string);
      });
  }

  goBack() {
    this.saveChanges();
    this.navController.navigateBack('home');
  }

  saveChanges() {
    this.userService.saveExtras(this.userService.user, this.extras).subscribe();
  }
}
