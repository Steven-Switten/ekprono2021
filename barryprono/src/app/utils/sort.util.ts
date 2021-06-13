import { getNestedProperty } from './object';

export function sortObjects(
  items: any[],
  fields: string | string[],
  order: number = 1,
  ignoreCase: boolean = false
): any[] {
  const sortedItems = items.sort(multiFieldSorter(fields, ignoreCase));
  return order === -1 ? sortedItems.reverse() : sortedItems;
}

export function multiFieldSorter(
  fields: string | string[],
  ignoreCase: boolean
): (a: any, b: any) => number {
  if (typeof fields === 'string') {
    fields = [fields as string];
  }
  return (a, b) => {
    return (fields as string[])
      .map((field) => {
        let dir = 1;
        if (field[0] === '-') {
          dir = -1;
          field = field.substring(1);
        }
        let valA = getNestedProperty(a, field);
        let valB = getNestedProperty(b, field);
        if (ignoreCase) {
          valA = `${valA}`.toLowerCase();
          valB = `${valB}`.toLowerCase();
        }
        if (valA > valB) return dir;
        if (valA < valB) return -dir;
        return 0;
      })
      .reduce((p, n) => {
        return p ? p : n;
      }, 0);
  };
}
