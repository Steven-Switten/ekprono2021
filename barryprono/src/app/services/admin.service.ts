import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
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
    return this.firestore.collection<Match>('matches').valueChanges();
  }
}
