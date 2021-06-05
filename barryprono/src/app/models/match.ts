export class Match {
  id: number = 0;
  homeTeam: string = '';
  awayTeam: string = '';
  date?: Date;
  time = '00:00';

  awayScore?: number;
  homeScore?: number;
  firstGoalMinute?: number;
}
