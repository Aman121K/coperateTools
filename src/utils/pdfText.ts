type TextToken = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function normalizeTextFragment(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function isPunctuation(token: string): boolean {
  return /^[,.;:!?%)\]}]+$/.test(token);
}

function shouldJoinWithoutSpace(prev: TextToken, next: TextToken): boolean {
  const prevEnd = prev.x + Math.max(prev.width, 0);
  const gap = next.x - prevEnd;
  const joinThreshold = Math.max(0.8, prev.height * 0.08);
  if (gap <= joinThreshold) return true;
  if (isPunctuation(next.text)) return true;
  if (/[-/(\[]$/.test(prev.text)) return true;
  return false;
}

function buildLines(tokens: TextToken[]): string[] {
  const sorted = [...tokens].sort((a, b) => {
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > 0.8) return yDiff;
    return a.x - b.x;
  });

  const medianHeight = sorted
    .map((t) => t.height)
    .sort((a, b) => a - b)[Math.floor(sorted.length / 2)] || 10;
  const lineTolerance = Math.max(2, medianHeight * 0.55);
  const lines: { y: number; tokens: TextToken[] }[] = [];

  for (const token of sorted) {
    const line = lines.find((candidate) => Math.abs(candidate.y - token.y) <= lineTolerance);
    if (line) {
      line.tokens.push(token);
      line.y = (line.y + token.y) / 2;
      continue;
    }
    lines.push({ y: token.y, tokens: [token] });
  }

  lines.sort((a, b) => b.y - a.y);
  return lines.map((line) => {
    const byX = [...line.tokens].sort((a, b) => a.x - b.x);
    let row = '';
    for (let i = 0; i < byX.length; i++) {
      const current = byX[i];
      if (i === 0) {
        row = current.text;
        continue;
      }
      const prev = byX[i - 1];
      row += shouldJoinWithoutSpace(prev, current) ? current.text : ` ${current.text}`;
    }
    return row.replace(/[ \t]+/g, ' ').trim();
  });
}

export async function extractReadablePageText(
  page: { getTextContent: () => Promise<{ items: unknown[] }> }
): Promise<string> {
  const content = await page.getTextContent();
  const tokens: TextToken[] = [];

  for (const item of content.items) {
    if (typeof item !== 'object' || !item) continue;
    if (!('str' in item) || typeof item.str !== 'string') continue;
    if (!('transform' in item) || !Array.isArray(item.transform) || item.transform.length < 6) continue;

    const text = normalizeTextFragment(item.str);
    if (!text) continue;

    const x = typeof item.transform[4] === 'number' ? item.transform[4] : 0;
    const y = typeof item.transform[5] === 'number' ? item.transform[5] : 0;
    const width = 'width' in item && typeof item.width === 'number' ? item.width : 0;
    const height = 'height' in item && typeof item.height === 'number' ? item.height : 10;

    tokens.push({ text, x, y, width, height });
  }

  if (!tokens.length) return '';
  return buildLines(tokens).join('\n').trim();
}

