import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent {
  usersRanked: User[] = [];

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
  }

  goBack() {
    this.navController.navigateBack('home');
  }

  getAvatar(user: User): string {
    if (user.name === 'Hendrik' || user.name.includes('Bum')) {
      return 'assets/hmu.png';
    }
    if (user.name.includes('Switten')) {
      return 'assets/ssw.png';
    }
    if (user.name.includes('Pieter')) {
      return 'assets/pvh.png';
    }
    if (user.name.includes('Steven')) {
      return 'assets/svdb.png';
    }
    if (user.name.includes('Dutch')) {
      return 'assets/ldp.png';
    }
    if (user.name.includes('Thomas')) {
      return 'assets/tfo.png';
    }
    if (
      user.name.includes('Tjang') ||
      user.name.toUpperCase().includes('TNX')
    ) {
      return 'assets/tnx.png';
    }
    if (user.name.includes('Nick') || user.name.toLowerCase().includes('cry')) {
      return 'assets/nsw.png';
    }
    if (user.name.includes('Bert') || user.name.includes('Berry')) {
      return 'assets/bvdn.png';
    }

    return '';
  }
}
