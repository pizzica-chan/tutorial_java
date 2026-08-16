import type { Lesson, Track, TrackId } from "../types";
import { webTrack } from "../content/web";
import { javaMapTrack } from "../content/javaMap";
import { readingTrack } from "../content/reading";
import { traceTrack } from "../content/trace";
import { troubleshootTrack } from "../content/troubleshoot";

export const tracks: Track[] = [
  webTrack,
  javaMapTrack,
  readingTrack,
  traceTrack,
  troubleshootTrack,
];

export const totalLessons = tracks.reduce((sum, track) => sum + track.lessons.length, 0);

export type LessonNav = {
  trackId: string;
  id: string;
  title: string;
};

function toNav(track: Track, lesson: Lesson): LessonNav {
  return { trackId: track.id, id: lesson.id, title: lesson.title };
}

export function getTrack(id: string | undefined): Track | undefined {
  return tracks.find((track) => track.id === id);
}

export function getLesson(trackId: string | undefined, lessonId: string | undefined) {
  const track = getTrack(trackId);
  if (!track) return undefined;
  const index = track.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return undefined;
  const trackIndex = tracks.findIndex((item) => item.id === track.id);

  let prev: LessonNav | undefined;
  let next: LessonNav | undefined;
  if (index > 0) {
    prev = toNav(track, track.lessons[index - 1]);
  } else if (trackIndex > 0) {
    const prevTrack = tracks[trackIndex - 1];
    prev = toNav(prevTrack, prevTrack.lessons[prevTrack.lessons.length - 1]);
  }
  if (index < track.lessons.length - 1) {
    next = toNav(track, track.lessons[index + 1]);
  } else if (trackIndex < tracks.length - 1) {
    const nextTrack = tracks[trackIndex + 1];
    next = toNav(nextTrack, nextTrack.lessons[0]);
  }

  return {
    track,
    lesson: track.lessons[index],
    index,
    prev,
    next,
  };
}

export function firstLessonPath(trackId: TrackId): string {
  const track = getTrack(trackId);
  return `/tracks/${trackId}/${track?.lessons[0]?.id ?? ""}`;
}

export function pageTitle(pathname: string): string {
  const site = "現場トレース";
  if (pathname === "/") return `${site} — Java Web の基礎と切り分け`;
  if (pathname === "/lab") return `ラボ — ${site}`;
  if (pathname === "/glossary" || pathname.startsWith("/glossary")) return `用語集 — ${site}`;
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "tracks" && parts[1] && parts[2]) {
    const found = getLesson(parts[1], parts[2]);
    if (found) return `${found.lesson.title} — ${site}`;
    return `項目が見つかりません — ${site}`;
  }
  if (parts[0] === "tracks" && parts[1]) {
    const track = getTrack(parts[1]);
    if (track) return `${track.title} — ${site}`;
    return `章が見つかりません — ${site}`;
  }
  return `ページが見つかりません — ${site}`;
}
