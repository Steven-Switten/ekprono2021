import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Extras } from '../models/extras';
import { Prono } from '../models/prono';
import { Metas } from '../models/metas';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class DataService {
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

  getAllExtras(): Observable<Extras[]> {
    return this.firestore
      .collection<Extras>('challenges')
      .valueChanges()
      .pipe(take(1));
  }

  saveExtras(user: string | undefined, extras: Extras): Observable<any> {
    return from(
      this.firestore
        .collection<Extras>('challenges')
        .doc(user)
        .set({ ...extras })
    );
  }

  loadMetas(user: string) {
    return this.firestore
      .collection<Metas>('metas')
      .valueChanges()
      .pipe(map((allMetas) => allMetas.find((a) => a.user === user)));
  }

  saveMetas(user: string | undefined, metas: Metas): Observable<any> {
    return from(
      this.firestore
        .collection<Metas>('metas')
        .doc(user)
        .set({ ...metas })
    );
  }

  saveProno(user: string | undefined, prono: Prono): Observable<any> {
    return from(
      this.firestore
        .collection<Prono>('pronos')
        .doc(`${user}-${prono.matchId}`)
        .set({ ...prono } as any)
    );
  }

  getProno(
    user: string | undefined,
    matchId: number | undefined
  ): Observable<Prono | undefined> {
    return this.firestore
      .collection<Prono>('pronos')
      .valueChanges()
      .pipe(
        take(1),
        map((pronos) => {
          return pronos.find((p) => p.matchId === matchId && p.user === user);
        })
      );
  }

  getPronos(matchId: number | undefined): Observable<Prono[]> {
    return this.firestore
      .collection<Prono>('pronos')
      .valueChanges()
      .pipe(
        take(1),
        map((pronos) => {
          return pronos.filter(
            (p) => p.matchId === matchId && p.user !== 'admin'
          );
        })
      );
  }

  getAllPronos(): Observable<Prono[]> {
    return this.firestore
      .collection<Prono>('pronos')
      .valueChanges()
      .pipe(
        take(1),
        map((pronos) => {
          return pronos.filter((p) => p.user !== 'admin');
        })
      );
  }

  getAllMatches(): Observable<Match[]> {
    return this.firestore
      .collection<Match>('matches')
      .valueChanges()
      .pipe(
        map((matches) => {
          const m = matches.map((m) => {
            const d = m.date as any;
            m.date = new Date((d.seconds * 1000) as any);
            return m;
          });

          m.sort((m1, m2) => (m1.id === m2.id ? 0 : m1.id < m2.id ? -1 : 1));
          return m;
        })
      );
  }

  createOrUpdateMatch(match: Match): Observable<any> {
    return from(
      this.firestore
        .collection<Match>('matches')
        .doc(match.id.toString())
        .set({ ...match })
    );
  }
}
