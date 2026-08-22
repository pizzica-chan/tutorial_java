import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { pageDescription, pageTitle, tracks, totalLessons } from "../data/curriculum";
import { lessonKey } from "../lib/progress";
import { useProgress } from "../hooks/useProgress";
import { SiteSearch } from "./SiteSearch";
import { Icon } from "./Icon";

function focusableIn(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea")].filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const completed = useProgress();
  const percent = Math.min(100, Math.round((completed.length / totalLessons) * 100));
  const trackMatch = location.pathname.match(/^\/tracks\/([^/]+)/);
  const currentTrackId = trackMatch?.[1];
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const title = pageTitle(location.pathname);
    const description = pageDescription(location.pathname);
    document.title = title;
    const set = (selector: string, value: string) => {
      document.querySelector(selector)?.setAttribute("content", value);
    };
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', description);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 目次を開いたまま広い画面になると、常時表示のサイドバーと本文の inert が食い違う
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const nav = navRef.current;
    if (!nav) return;
    const items = focusableIn(nav);
    items[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !navRef.current) return;
      const loop = focusableIn(navRef.current);
      if (loop.length === 0) return;
      const first = loop[0];
      const last = loop[loop.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        本文へ
      </a>
      {open ? (
        <button className="backdrop" type="button" aria-label="メニューを閉じる" onClick={() => setOpen(false)} />
      ) : null}
      <aside
        id="site-nav"
        ref={navRef}
        className={`sidebar ${open ? "open" : ""}`}
        aria-label="目次"
      >
        <button
          className="btn btn-ghost sidebar-close"
          type="button"
          onClick={() => {
            setOpen(false);
            toggleRef.current?.focus();
          }}
        >
          <Icon name="close" size={14} />
          閉じる
        </button>
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img className="brand-mark" src="/favicon.svg" width={42} height={42} alt="" />
          <span>
            <span className="brand-name">現場で読む Java Web</span>
            <br />
            <span className="brand-sub">既存コード</span>
          </span>
        </NavLink>

        <div className="nav-label">CONTENTS</div>
        {tracks.map((track) => (
          <div key={track.id} className="nav-group">
            <NavLink
              to={`/tracks/${track.id}`}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="no">{track.no}</span>
              <span>{track.title}</span>
            </NavLink>
            {currentTrackId === track.id ? (
              <div className="nav-lessons">
                {track.lessons.map((lesson) => {
                  const done = completed.includes(lessonKey(track.id, lesson.id));
                  return (
                    <NavLink
                      key={lesson.id}
                      to={`/tracks/${track.id}/${lesson.id}`}
                      className={({ isActive }) => `nav-sub ${isActive ? "active" : ""} ${done ? "done" : ""}`}
                    >
                      {done ? <Icon name="check" size={12} /> : <span className="nav-dot" />}
                      {lesson.title}
                    </NavLink>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}

        <div className="nav-label">LAB</div>
        <NavLink to="/lab" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
          <span className="no">
            <Icon name="lab" size={14} />
          </span>
          <span>ラボ</span>
        </NavLink>
        <NavLink
          to="/glossary"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setOpen(false)}
        >
          <span className="no">
            <Icon name="book" size={14} />
          </span>
          <span>用語集</span>
        </NavLink>

        <div className="progress-card">
          <strong>読了 {Math.min(completed.length, totalLessons)} / {totalLessons}</strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={`読了 ${Math.min(completed.length, totalLessons)} / ${totalLessons}`}
          >
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span style={{ color: "var(--quiet)", fontSize: 12 }}>進捗はブラウザ内にだけ保存されます</span>
        </div>
      </aside>

      <main className="main" id="main" tabIndex={-1} inert={open}>
        <header className="topbar">
          <button
            ref={toggleRef}
            className="btn btn-ghost mobile-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            目次
          </button>
          <p className="topbar-tagline">HTTP と Java Web。既存コードの追跡と、症状別の切り分け。</p>
          <SiteSearch />
          <p style={{ fontFamily: "var(--mono)", color: "var(--amber)" }} aria-label={`読了 ${percent}パーセント`}>
            {percent}%
          </p>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
