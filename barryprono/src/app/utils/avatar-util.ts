import { User } from '../models/user';

export function getAvatar(user: string): string {
  if (user.includes('Beating')) {
    return 'assets/hmu2.png';
  }
  if (user === 'Hendrik' || user.includes('Bum')) {
    return 'assets/hmu.png';
  }
  if (user.includes('Switten')) {
    return 'assets/ssw.png';
  }
  if (user.includes('Pieter')) {
    return 'assets/pvh.png';
  }
  if (user.includes('Steven')) {
    return 'assets/svdb.png';
  }
  if (user.includes('Dutch')) {
    return 'assets/tnx.png';
  }
  if (user.includes('Leprechaun')) {
    return 'assets/ldp.png';
  }
  if (user.includes('Thomas')) {
    return 'assets/tfo.png';
  }
  if (user.includes('Tjang') || user.toUpperCase().includes('TNX')) {
    return 'assets/tnx.png';
  }

  if (user.includes('Nick') || user.toLowerCase().includes('cry')) {
    return 'assets/nsw.png';
  }
  if (user.includes('Bert') || user.includes('Berry')) {
    return 'assets/bvdn.png';
  }
  if (
    user.toLowerCase().includes('floris') ||
    user.toLowerCase().includes('ranzi')
  ) {
    return 'assets/ffr.png';
  }

  return '';
}
