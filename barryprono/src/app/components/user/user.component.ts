import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { take, tap, switchMap } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { Metas } from 'src/app/models/metas';
import { DataService } from 'src/app/services/data.service';
import { getAvatar } from 'src/app/utils/avatar-util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  userName: string = '';
  extras?: Extras;
  metas?: Metas;

  get isDeadLinePast(): boolean {
    return new Date(2021, 5, 11, 21, 0, 0) <= new Date();
  }

  constructor(
    private dataService: DataService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  goBack() {
    this.navController.navigateBack('home');
  }

  ionViewWillEnter() {
    if (!this.dataService.user) {
      this.navController.navigateRoot('login');
      return;
    }

    this.route.params
      .pipe(
        take(1),
        tap((params) => {
          this.userName = params.id;
          if (this.userName.includes('BeatingBumBeirt')) {
            this.userName = 'B³ (BeatingBumBeirt)';
          }
        }),
        switchMap(() => this.dataService.loadExtras(this.userName)),
        tap((e) => (this.extras = e)),
        switchMap(() => this.dataService.loadMetas(this.userName)),
        tap((e) => (this.metas = e))
      )
      .subscribe();
  }

  getAvatar(user: string | undefined): string {
    return getAvatar(user ?? '');
  }

  getFlag(country: string | undefined): string {
    if (country) {
      return `assets/flags/${country.toLowerCase()}.png`;
    }
    return ``;
  }

  getAvatarBumOrSwiggy(bumOrSwiggy: string | undefined): string {
    if (bumOrSwiggy === 'swiggy') {
      return getAvatar('B³ (BeatingBumBeirt)');
    }
    return getAvatar('BumBeirt');
  }
}
