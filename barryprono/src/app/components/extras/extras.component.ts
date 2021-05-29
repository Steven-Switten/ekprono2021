import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss'],
})
export class ExtrasComponent {
  constructor(
    private userService: UserService,
    private navController: NavController
  ) {}

  goBack() {
    this.navController.navigateBack('home');
  }
  saveChanges() {}
}
