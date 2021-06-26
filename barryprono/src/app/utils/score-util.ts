import { Prono } from '../models/prono';
import { Match } from '../models/match';

export function calculatePronoScore(
  prono: Prono | undefined,
  matchResult: Match | undefined,
  luckyGoalOnly: boolean = false,
  calculateLuckyGoal: boolean = true,
  winnerOnly: boolean = false
): number {
  let totalScore = 0;

  if (
    !prono ||
    !matchResult ||
    matchResult.awayScore === undefined ||
    matchResult.homeScore === undefined ||
    prono.homeScore === undefined ||
    prono.awayScore === undefined
  ) {
    return 0;
  }

  if (matchResult.firstGoalMinute !== null && calculateLuckyGoal) {
    if (prono.firstGoalMinute === matchResult.firstGoalMinute) {
      totalScore += 2;
    } else if (
      prono.firstGoalMinute === (matchResult.firstGoalMinute as number) + 1 ||
      prono.firstGoalMinute === (matchResult.firstGoalMinute as number) + 2 ||
      prono.firstGoalMinute === (matchResult.firstGoalMinute as number) - 1 ||
      prono.firstGoalMinute === (matchResult.firstGoalMinute as number) - 2
    ) {
      totalScore += 1;
    }
  }
  if (luckyGoalOnly) {
    return totalScore;
  }

  const matchWinner =
    matchResult.matchWinner ?? matchResult.homeScore === matchResult.awayScore
      ? 'draw'
      : matchResult.homeScore > matchResult.awayScore
      ? 'home'
      : 'away';

  const pronoWinner =
    prono.homeScore === prono.awayScore && !prono.matchWinner
      ? 'draw'
      : prono.matchWinner === matchResult.homeTeam
      ? 'home'
      : prono.matchWinner === matchResult.awayTeam
      ? 'away'
      : prono.homeScore > prono.awayScore
      ? 'home'
      : 'away';

  if (matchWinner === pronoWinner) {
    totalScore += 5;
  }
  if (winnerOnly) {
    return totalScore;
  }

  const matchGoalDiff = matchResult.homeScore - matchResult.awayScore;
  const pronoGoalDiff = prono.homeScore - prono.awayScore;
  if (matchGoalDiff === pronoGoalDiff) {
    totalScore += 2;
  }

  if (prono.homeScore === matchResult.homeScore) {
    totalScore += 1;
  }
  if (prono.awayScore === matchResult.awayScore) {
    totalScore += 1;
  }

  return totalScore;
}
