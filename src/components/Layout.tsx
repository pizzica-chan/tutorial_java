import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { pageTitle, tracks, totalLessons } from "../data/curriculum";
import { lessonKey } from "../lib/progress";
import { useProgress } from "../hooks/useProgress";
import { SiteSearch } from "./SiteSearch";
import { Icon } from "./Icon";

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const completed = useProgress();
  const percent = Math.min(100, Math.round((completed.length / totalLessons) * 100));
  const trackMatch = location.pathname.match(/^\/tracks\/([^/]+)/);
  const currentTrackId = trackMatch?.[1];

  useEffect(() => {
    document.title = pageTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        本文へ
      </a>
      {open ? (
        <button className="backdrop" type="button" aria-label="メニューを閉じる" onClick={() => setOpen(false)} />
      ) : null}
      <aside id="site-nav" className={`sidebar ${open ? "open" : ""}`}>
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">追</span>
          <span>
            <span className="brand-name">現場トレース</span>
            <br />
            <span className="brand-sub">GENBA TRACE</span>
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
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span style={{ color: "var(--quiet)", fontSize: 12 }}>進捗はブラウザ内にだけ保存されます</span>
        </div>
      </aside>

      <div className="main" id="main" tabIndex={-1}>
        <header className="topbar">
          <button
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
      </div>
    </div>
  );
}
