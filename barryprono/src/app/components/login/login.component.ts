import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

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

  constructor(
    private userService: UserService,
    private navController: NavController
  ) {}

  onNameChange() {
    if (this.name) {
      this.userService
        .findUser(this.name)
        .pipe(
          take(1),
          tap((user) => {
            this.userExists = !!user;
            this.realPassword = user?.password;
          })
        )
        .subscribe();
    } else {
      this.userExists = false;
    }
  }

  login(): void {
    if (this.realPassword == this.password && this.userExists) {
      if (this.userService.login(this.name as string)) {
        this.navController.navigateForward('home');
      }
    } else {
      this.error = 'Password is fout';
    }
  }

  register(): void {
    this.userService
      .register(this.name as string, this.password as string)
      .then(() => {
        this.navController.navigateForward('home');
      });
  }
}
