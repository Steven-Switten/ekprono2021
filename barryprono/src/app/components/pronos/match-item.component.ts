import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Match } from '../../models/match';

@Component({
  selector: 'app-match-item',
  template: ` <ion-item (click)="goToMatch(match)"
    ><ion-label class="w-100pct"
      ><div class="flex-row w-100pct flex-space space-between">
        <ion-avatar class="country">
          <img [src]="getCountryAvatar(match.homeTeam)" />
        </ion-avatar>
        <div class="flex-column flex-center">
          <h3>{{ match.homeTeam }} - {{ match.awayTeam }}</h3>
          <p>{{ match.date | date: 'dd/MM - HH:mm' }}</p>
        </div>
        <ion-avatar class="country">
          <img [src]="getCountryAvatar(match.awayTeam)" />
        </ion-avatar>
      </div>
    </ion-label>
    <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
  </ion-item>`,
})
export class MatchItemComponent {
  @Input()
  match!: Match;

  constructor(private navController: NavController) {}

  getCountryAvatar(country: string) {
    return `assets/flags/${country.toLowerCase()}.png`;
  }

  goToMatch(match: Match) {
    this.navController.navigateForward(`pronos/detail/${match.id}`);
  }
}
