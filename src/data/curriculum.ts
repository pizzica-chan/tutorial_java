import type { Block, Lesson, Track, TrackId } from "../types";
import { introTrack } from "../content/intro";
import { webTrack } from "../content/web";
import { javaMapTrack } from "../content/javaMap";
import { readingTrack } from "../content/reading";
import { traceTrack } from "../content/trace";
import { troubleshootTrack } from "../content/troubleshoot";
import { scenarioTrack } from "../content/scenario";

export const tracks: Track[] = [
  introTrack,
  webTrack,
  javaMapTrack,
  readingTrack,
  traceTrack,
  troubleshootTrack,
  scenarioTrack,
];

export const totalLessons = tracks.reduce((sum, track) => sum + track.lessons.length, 0);

/** 項目の先頭段落から、メタ説明や章一覧用の短いリードを取る */
export function lessonLead(lesson: Lesson, max = 72): string {
  const block = lesson.blocks.find((item): item is Extract<Block, { type: "p" }> => item.type === "p");
  if (!block) return lesson.title;
  const sentence = block.text.split("。")[0] ?? block.text;
  const lead = block.text.includes("。") ? `${sentence}。` : sentence;
  if (lead.length <= max) return lead;
  return `${lead.slice(0, max)}…`;
}

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

export function pageDescription(pathname: string): string {
  const fallback = "Java Web アプリの基礎と、症状別トラブルシュート。既存コードの読み方。";
  if (pathname === "/") return fallback;
  if (pathname === "/lab") return "申請くんのソース、HTTP、リクエスト区間、スタックトレースを確認するラボ。";
  if (pathname === "/glossary" || pathname.startsWith("/glossary")) {
    return "HTTP、Java Web、Spring まわりの用語。本文の点線から飛びます。";
  }
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "tracks" && parts[1] && parts[2]) {
    const found = getLesson(parts[1], parts[2]);
    if (found) return lessonLead(found.lesson, 110);
    return fallback;
  }
  if (parts[0] === "tracks" && parts[1]) {
    const track = getTrack(parts[1]);
    if (track) return track.description;
  }
  return fallback;
}

export function pageTitle(pathname: string): string {
  const site = "参画前に知っておきたい Java Web";
  if (pathname === "/") return `${site} — 基礎と切り分け`;
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
