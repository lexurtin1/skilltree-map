/**
 * Squarified treemap layout (Bruls, Huizing, van Wijk).
 *
 * Plain slice-and-dice produces slivers you cannot read a label in; squarifying
 * keeps cells close to square, which is the only reason a treemap is legible at
 * panel size.
 *
 * Geometry only, and deliberately so: it lived inside the SVG treemap until the
 * Accounts panel needed the same layout rendered as real DOM — every cell there
 * is a link with a hover state and a pulse, none of which an SVG rect does well.
 * Both renderers now lay out through this, so they cannot disagree.
 *
 * Deterministic: fixed input order in, identical geometry out, on the server and
 * in the browser.
 */

export interface Sized {
  id: string;
  value: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function squarifyLayout<T extends Sized>(
  cells: T[],
  x: number,
  y: number,
  w: number,
  h: number,
): Array<T & Box> {
  const total = cells.reduce((s, c) => s + c.value, 0);
  if (total <= 0 || !cells.length) return [];

  const out: Array<T & Box> = [];
  let items = [...cells].sort((a, b) => b.value - a.value);
  let area = (w * h) / total;
  let rx = x;
  let ry = y;
  let rw = w;
  let rh = h;

  const worst = (row: T[], side: number) => {
    const sum = row.reduce((s, c) => s + c.value * area, 0);
    const max = Math.max(...row.map((c) => c.value * area));
    const min = Math.min(...row.map((c) => c.value * area));
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };

  while (items.length) {
    const side = Math.min(rw, rh);
    const row: T[] = [items[0]];
    let i = 1;
    while (i < items.length && worst([...row, items[i]], side) <= worst(row, side)) {
      row.push(items[i]);
      i++;
    }

    const sum = row.reduce((s, c) => s + c.value * area, 0);
    const thickness = sum / side;

    let offset = 0;
    for (const cell of row) {
      const length = (cell.value * area) / thickness;
      if (rw >= rh) {
        out.push({ ...cell, x: rx, y: ry + offset, w: thickness, h: length });
      } else {
        out.push({ ...cell, x: rx + offset, y: ry, w: length, h: thickness });
      }
      offset += length;
    }

    if (rw >= rh) {
      rx += thickness;
      rw -= thickness;
    } else {
      ry += thickness;
      rh -= thickness;
    }

    items = items.slice(row.length);
    if (rw <= 0.5 || rh <= 0.5) break;
    area = (rw * rh) / items.reduce((s, c) => s + c.value, 0 as number) || area;
  }

  return out;
}
