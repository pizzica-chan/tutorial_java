import { tracks } from "../data/curriculum";

const KEY = "genba-trace-progress-v1";
const LAST_KEY = "genba-trace-last-v1";

export type LessonRef = { trackId: string; lessonId: string };

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function getCompleted(): string[] {
  return read();
}

export function isCompleted(id: string): boolean {
  return read().includes(id);
}

export function toggleCompleted(id: string): string[] {
  const current = new Set(read());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  const next = [...current];
  let saved = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 容量超過やプライベートモードでは保存できない。画面は実際の中身に合わせる
    saved = read();
  }
  window.dispatchEvent(new Event("genba-progress"));
  return saved;
}

export function lessonKey(trackId: string, lessonId: string): string {
  return `${trackId}/${lessonId}`;
}

export function setLastLesson(trackId: string, lessonId: string) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ trackId, lessonId } satisfies LessonRef));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getLastLesson(): LessonRef | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const { trackId, lessonId } = parsed as Partial<LessonRef>;
      if (typeof trackId === "string" && typeof lessonId === "string") return { trackId, lessonId };
    }
    return null;
  } catch {
    return null;
  }
}

export function hasStarted(completed: string[]): boolean {
  return completed.length > 0 || getLastLesson() !== null;
}

export function continueHref(completed: string[]): string | undefined {
  const all = tracks.flatMap((track) =>
    track.lessons.map((lesson) => ({
      trackId: track.id,
      lessonId: lesson.id,
      key: lessonKey(track.id, lesson.id),
    })),
  );
  const last = getLastLesson();
  const start = last
    ? all.findIndex((item) => item.trackId === last.trackId && item.lessonId === last.lessonId)
    : -1;
  const from = start >= 0 ? all.slice(start) : all;
  const next = from.find((item) => !completed.includes(item.key)) ?? all.find((item) => !completed.includes(item.key));
  if (next) return `/tracks/${next.trackId}/${next.lessonId}`;
  if (start >= 0 && last) return `/tracks/${last.trackId}/${last.lessonId}`;
  return undefined;
}
