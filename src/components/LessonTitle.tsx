const TAG_CLASS: Record<string, string> = {
  障害調査: "tag-trouble",
  影響調査: "tag-impact",
};

const TAG_PATTERN = /^\[([^\]]+)\]\s*(.*)$/;

/** レッスンタイトル先頭の `[障害調査]` などのタグを、色分けしたバッジにする */
export function LessonTitle({ title }: { title: string }) {
  const match = title.match(TAG_PATTERN);
  if (!match) return <>{title}</>;
  const [, tag, rest] = match;
  const tagClass = TAG_CLASS[tag];
  return (
    <>
      <span className={`title-tag${tagClass ? ` ${tagClass}` : ""}`}>{tag}</span> {rest}
    </>
  );
}
