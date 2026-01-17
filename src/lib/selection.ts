export function parseCsv(value: string): string[] {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter((v) => v.length > 0);
}

export function toggleCsvValue(value: string, next: string): string {
  const values = parseCsv(value);
  const idx = values.indexOf(next);
  if (idx >= 0) {
    values.splice(idx, 1);
  } else {
    values.push(next);
  }
  return values.join(', ');
}

export function hasCsvValue(value: string, next: string): boolean {
  return parseCsv(value).includes(next);
}
