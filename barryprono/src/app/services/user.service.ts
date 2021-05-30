import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Extras } from '../models/extras';
import { Prono } from '../models/prono';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user?: string;
  constructor(private firestore: AngularFirestore) {
    const storedUser = localStorage.getItem('activeuser');
    if (storedUser) {
      this.user = storedUser;
    }
  }

  findUser(user: string): Observable<User | undefined> {
    return this.firestore
      .collection<User>('users')
      .valueChanges()
      .pipe(
        take(1),
        map((users) => users.find((u) => u.name == user))
      );
  }

  login(user: string): boolean {
    this.user = user;
    localStorage.setItem('activeuser', user);
    return true;
  }

  getAllUsers() {
    return this.firestore.collection<User>('users').valueChanges();
  }

  register(name: string, password: string): Promise<any> {
    return this.firestore
      .collection<User>('users')
      .doc(name)
      .set({ name: name, password: password, score: 0 });
  }

  loadExtras(user: string): Observable<Extras | undefined> {
    return this.firestore
      .collection<Extras>('challenges')
      .valueChanges()
      .pipe(map((allExtras) => allExtras.find((a) => a.user === user)));
  }

  saveExtras(user: string | undefined, extras: Extras): Observable<any> {
    return from(
      this.firestore
        .collection<Extras>('challenges')
        .doc(user)
        .set({ ...extras })
    );
  }

  saveProno(user: string | undefined, prono: Prono): Observable<any> {
    return from(
      this.firestore
        .collection<Prono>('pronos')
        .doc(`${user}-${prono.matchId}`)
        .set({ ...prono })
    );
  }
}
