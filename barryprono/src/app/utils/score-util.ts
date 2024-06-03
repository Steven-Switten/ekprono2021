import { Prono } from '../models/prono';
import { Match } from '../models/match';
import { Extras } from '../models/extras';
import { Metas } from '../models/metas';

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

  let matchWinner = 'draw';
  if (matchResult.matchWinner) {
    matchWinner =
      matchResult.matchWinner === matchResult.homeTeam ? 'home' : 'away';
  } else {
    matchWinner =
      matchResult.homeScore === matchResult.awayScore
        ? 'draw'
        : matchResult.homeScore > matchResult.awayScore
        ? 'home'
        : 'away';
  }

  let pronoWinner = '';
  if (prono.homeScore === prono.awayScore && !prono.matchWinner) {
    pronoWinner = 'draw';
  } else if (prono.homeScore === prono.awayScore && prono.matchWinner) {
    pronoWinner = prono.matchWinner === matchResult.homeTeam ? 'home' : 'away';
  } else {
    pronoWinner = prono.homeScore > prono.awayScore ? 'home' : 'away';
  }

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

export function calculateGroupWinnerScores(
  extras: Extras,
  adminExtras: Extras
): number {
  let score = 0;

  if (adminExtras.winnerA === extras.winnerA) {
    score += 1;
  }
  if (adminExtras.winnerB === extras.winnerB) {
    score += 1;
  }
  if (adminExtras.winnerC === extras.winnerC) {
    score += 1;
  }
  if (adminExtras.winnerD === extras.winnerD) {
    score += 1;
  }
  if (adminExtras.winnerE === extras.winnerE) {
    score += 1;
  }
  if (adminExtras.winnerF === extras.winnerF) {
    score += 1;
  }
  if (adminExtras.loserA === extras.loserA) {
    score += 1;
  }
  if (adminExtras.loserB === extras.loserB) {
    score += 1;
  }
  if (adminExtras.loserC === extras.loserC) {
    score += 1;
  }
  if (adminExtras.loserD === extras.loserD) {
    score += 1;
  }
  if (adminExtras.loserE === extras.loserE) {
    score += 1;
  }
  if (adminExtras.loserF === extras.loserF) {
    score += 1;
  }

  if (adminExtras.winnerAll === extras.winnerAll) {
    score += 10;
  }
  if (adminExtras.secondPlace === extras.secondPlace) {
    score += 2;
  }

  if (
    extras.thirdPlace === adminExtras.thirdPlace ||
    extras.thirdPlace === adminExtras.fourthPlace
  ) {
    score += 1;
  }

  if (
    extras.fourthPlace === adminExtras.thirdPlace ||
    extras.fourthPlace === adminExtras.fourthPlace
  ) {
    score += 1;
  }

  return score;
}

export function calculateMetaScores(metas: Metas, adminMetas: Metas): number {
  let score = 0;
  if (!adminMetas.winner.includes('Beating')) {
    console.log('not ready yet');
    return score;
  }
  if (adminMetas.winner === metas.winner) {
    score += 1;
  }
  if (adminMetas.lucky === metas.lucky) {
    score += 1;
  }
  if (adminMetas.unlucky === metas.unlucky) {
    score += 1;
  }
  if (adminMetas.loser === metas.loser) {
    score += 1;
  }
  if (adminMetas.bumOrSwiggy === metas.bumOrSwiggy) {
    score += 1;
  }
  console.log('meta points:', metas.user, score);
  return score;
}
