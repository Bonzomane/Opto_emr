export interface RxParts {
  sph: string;
  cyl: string;
  axis: string;
}

function normalizeRxString(rx: string): string {
  let cleaned = rx
    .replace(/−/g, '-')
    .replace(/\s+sph\.\s*$/i, '')
    .replace(/\//g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  // If 3 numbers and no "x", insert it between cyl and axis
  const threeNumbers = cleaned.match(/^([+-]?\d+\.?\d*)\s+([+-]?\d+\.?\d*)\s+(\d+)$/);
  if (threeNumbers) {
    cleaned = `${threeNumbers[1]} ${threeNumbers[2]} x ${threeNumbers[3]}`;
  }

  return cleaned;
}

export function parseRxParts(rx: string): RxParts {
  if (!rx) return { sph: '', cyl: '', axis: '' };

  let cleaned = normalizeRxString(rx);
  let hasPlano = false;

  if (cleaned.toLowerCase().startsWith('plano ')) {
    hasPlano = true;
    cleaned = cleaned.slice(6).trim();
  }

  const tokens = cleaned.split(' ').filter(Boolean);
  const xIndex = tokens.findIndex((t) => t.toLowerCase() === 'x');

  let sph = '';
  let cyl = '';
  let axis = '';

  if (xIndex >= 0) {
    axis = tokens[xIndex + 1] || '';
    if (xIndex === 1) {
      // Format: cyl x axis (no sphere)
      cyl = tokens[0] || '';
    } else if (xIndex >= 2) {
      sph = tokens[0] || '';
      cyl = tokens[1] || '';
    }
  } else {
    if (tokens.length === 1) {
      sph = tokens[0] || '';
    } else if (tokens.length >= 2) {
      sph = tokens[0] || '';
      cyl = tokens[1] || '';
    }
  }

  if (!sph && hasPlano) {
    sph = 'plano';
  }

  return { sph, cyl, axis };
}

export function parseRxNumbers(rx: string): { sph: number | null; cyl: number | null; axis: number | null } {
  const parts = parseRxParts(rx);
  const sph = parts.sph.toLowerCase() === 'plano' ? 0 : parseFloat(parts.sph);
  const cyl = parseFloat(parts.cyl);
  const axis = parseInt(parts.axis, 10);
  return {
    sph: Number.isFinite(sph) ? sph : null,
    cyl: Number.isFinite(cyl) ? cyl : null,
    axis: Number.isFinite(axis) ? axis : null,
  };
}

export function formatRxDisplay(rx: string): string {
  if (!rx) return '';

  const parts = parseRxParts(rx);

  if (!parts.cyl) {
    if (!parts.sph) return '';
    if (parts.sph.toLowerCase() === 'plano') return 'plano';
    return `${parts.sph} sph.`;
  }

  const sph = parts.sph ? parts.sph : 'plano';
  if (parts.axis) {
    return `${sph} ${parts.cyl} x ${parts.axis}`;
  }
  return `${sph} ${parts.cyl}`;
}
