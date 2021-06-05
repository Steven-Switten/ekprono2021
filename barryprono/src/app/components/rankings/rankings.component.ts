import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { getAvatar } from 'src/app/utils/avatar-util';

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
    private userService: UserService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.userService
      .getAllUsers()
      .pipe(
        map((usrs) => {
          const users = usrs.map((u) => {
            const ucopy = { ...u };
            ucopy.score = u.score ?? 0;
            return ucopy;
          });
          return users
            .filter((u) => u.name !== 'admin')
            .sort((m1, m2) =>
              m1.score === m2.score ? 0 : m2.score < m1.score ? -1 : 1
            );
        }),
        tap((usr) => (this.usersRanked = usr))
      )
      .subscribe();

    this.userService
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

    console.log('country', country, user.name);
    if (country) {
      return `assets/flags/${country}.png`;
    }
    return ``;
  }

  goToUserDetail(user: User) {}
}
