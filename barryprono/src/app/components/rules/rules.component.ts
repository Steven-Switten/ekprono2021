import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent {
  constructor(private navController: NavController) {}

  goBack() {
    this.navController.navigateBack('home');
  }
}
