export class Metas {
  winner = '';
  loser = '';
  lucky = '';
  unlucky = '';
  bumOrSwiggy = '';

  user?: string;

  constructor(user: string) {
    this.user = user;
  }
}
