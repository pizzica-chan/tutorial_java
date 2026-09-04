import type { Block } from "../types";

/**
 * 記事内の各ブロックへ、リンク用の id を1つずつ割り当てる。
 * 見出しは記事内目次（extractHeadings）と同じ id を使うので、番号の振り方を合わせる。
 * サイト内検索は、この id をハッシュに付けて一致した箇所へ飛ばす。
 */
export function blockAnchorIds(blocks: Block[]): string[] {
  const ids: string[] = [];
  let headingIndex = 0;
  blocks.forEach((block, index) => {
    if (block.type === "h2" || block.type === "h3") {
      ids.push(`h-${headingIndex}`);
      headingIndex += 1;
    } else {
      ids.push(`b-${index}`);
    }
  });
  return ids;
}

/** 章ページのレッスン行に振る id */
export function lessonRowAnchor(lessonId: string): string {
  return `lesson-${lessonId}`;
}
