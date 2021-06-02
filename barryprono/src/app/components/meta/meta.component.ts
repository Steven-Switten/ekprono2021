import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { Metas } from 'src/app/models/metas';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss'],
})
export class MetaComponent {
  metas: Metas = new Metas('');
  get canEdit(): boolean {
    return new Date(2021, 5, 11, 21, 0, 0) > new Date();
  }
  allUsers: User[] = [];

  constructor(
    private userService: UserService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    if (!this.userService.user) {
      this.navController.navigateRoot('login');
      return;
    }
    this.userService
      .getAllUsers()
      .subscribe((u) => (this.allUsers = u.filter((u) => u.name !== 'admin')));

    this.userService
      .loadMetas(this.userService.user)
      .pipe(take(1))
      .subscribe((metas) => {
        this.metas = metas ?? new Metas(this.userService.user as string);
      });
  }

  goBack() {
    this.saveChanges();
    this.navController.navigateBack('home');
  }

  saveChanges() {
    this.userService.saveMetas(this.userService.user, this.metas).subscribe();
  }
}
