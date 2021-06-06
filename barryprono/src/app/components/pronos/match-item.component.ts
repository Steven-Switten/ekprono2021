import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Match } from '../../models/match';
import { DataService } from '../../services/data.service';
import { Prono } from '../../models/prono';

@Component({
  selector: 'app-match-item',
  template: ` <ion-item (click)="goToMatch(match)"
    ><ion-label class="w-100pct"
      ><div class="flex-row w-100pct flex-space space-between">
        <ion-avatar class="country">
          <img [src]="getCountryAvatar(match.homeTeam)" />
        </ion-avatar>
        <div
          class="flex-column flex-center"
          [ngClass]="{ ready: isReady, missing: !isReady }"
        >
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
export class MatchItemComponent implements OnChanges {
  @Input()
  match!: Match;

  prono?: Prono;
  constructor(
    private navController: NavController,
    private dataService: DataService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.match) {
      this.dataService
        .getProno(this.dataService.user, this.match.id)
        .subscribe((p) => (this.prono = p));
    }
  }

  getCountryAvatar(country: string) {
    return `assets/flags/${country.toLowerCase()}.png`;
  }

  goToMatch(match: Match) {
    this.navController.navigateForward(`pronos/detail/${match.id}`);
  }

  get isReady() {
    return (
      this.prono?.homeScore !== undefined &&
      this.prono?.awayScore !== undefined &&
      this.prono?.firstGoalMinute !== undefined
    );
  }
}
