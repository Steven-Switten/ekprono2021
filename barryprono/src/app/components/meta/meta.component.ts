import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Extras } from 'src/app/models/extras';
import { Metas } from 'src/app/models/metas';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';

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
    private dataService: DataService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    if (!this.dataService.user) {
      this.navController.navigateRoot('login');
      return;
    }
    this.dataService
      .getAllUsers()
      .subscribe((u) => (this.allUsers = u.filter((u) => u.name !== 'admin')));
  }

  ionViewDidEnter() {
    this.dataService
      .loadMetas(this.dataService.user as string)
      .subscribe((metas) => {
        this.metas = metas ?? new Metas(this.dataService.user as string);
      });
  }

  goBack() {
    this.saveChanges();
    this.navController.navigateBack('home');
  }

  saveChanges() {
    this.dataService.saveMetas(this.dataService.user, this.metas).subscribe();
  }
}
