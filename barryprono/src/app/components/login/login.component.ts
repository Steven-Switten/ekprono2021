import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  name?: string;
  password?: string;
  realPassword?: string;
  userExists = false;
  error?: string;
  checkUser$ = new Subject<string>();

  constructor(
    private dataService: DataService,
    private navController: NavController
  ) {
    this.checkUser$
      .pipe(
        debounceTime(400),
        switchMap(() => this.dataService.findUser(this.name as string)),
        tap((user) => {
          this.userExists = !!user;
          this.realPassword = user?.password;
        })
      )
      .subscribe();
  }

  onNameChange() {
    this.checkUser$.next(this.name);
  }

  login(): void {
    if (this.realPassword == this.password && this.userExists) {
      if (this.dataService.login(this.name as string)) {
        this.navController.navigateForward('home');
      }
    } else {
      this.error = 'Password is fout';
    }
  }

  register(): void {
    this.dataService
      .register(this.name as string, this.password as string)
      .then(() => {
        this.navController.navigateForward('home');
      });
  }
}
