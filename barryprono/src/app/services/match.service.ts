import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private firestore: AngularFirestore) {}

  createOrUpdateMatch(match: Match): Observable<any> {
    return from(
      this.firestore
        .collection<Match>('matches')
        .doc(match.id.toString())
        .set({ ...match })
    );
  }

  getAllMatches(): Observable<Match[]> {
    return this.firestore
      .collection<Match>('matches')
      .valueChanges()
      .pipe(
        map((matches) =>
          matches.sort((m1, m2) =>
            m1.id === m2.id ? 0 : m1.id < m2.id ? -1 : 1
          )
        )
      );
  }
}
