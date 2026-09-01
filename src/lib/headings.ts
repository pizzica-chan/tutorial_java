import type { Block } from "../types";

export type HeadingEntry = { id: string; text: string; level: 2 | 3 };

/** 記事内目次用に、h2/h3 ブロックへ通し番号の id を振る */
export function extractHeadings(blocks: Block[]): HeadingEntry[] {
  const result: HeadingEntry[] = [];
  let index = 0;
  for (const block of blocks) {
    if (block.type === "h2" || block.type === "h3") {
      result.push({ id: `h-${index}`, text: block.text, level: block.type === "h2" ? 2 : 3 });
      index += 1;
    }
  }
  return result;
}
