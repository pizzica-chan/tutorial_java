import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { pageDescription, pageTitle, tracks } from "../data/curriculum";
import { SiteSearch } from "./SiteSearch";
import { Icon } from "./Icon";

function focusableIn(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea")].filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia("(min-width: 901px)").matches);
  const location = useLocation();
  const trackMatch = location.pathname.match(/^\/tracks\/([^/]+)/);
  const currentTrackId = trackMatch?.[1];
  const [expandedTrackIds, setExpandedTrackIds] = useState<Set<string>>(
    () => new Set(currentTrackId ? [currentTrackId] : []),
  );
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileDialogOpen = isMobile && open;

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
    setExpandedTrackIds(new Set(currentTrackId ? [currentTrackId] : []));
  }, [currentTrackId]);

  const hasNavigatedRef = useRef(false);
  const pendingFocusRef = useRef(false);
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
    // 初回表示ではフォーカスを奪わない。ページャーなどでの遷移時だけ本文へ移す
    if (hasNavigatedRef.current) {
      pendingFocusRef.current = true;
    }
    hasNavigatedRef.current = true;
  }, [location.pathname]);

  useEffect(() => {
    if (!pendingFocusRef.current || mobileDialogOpen) return;
    // モバイルの目次を開いたまま選ぶと、この時点ではまだ #main が inert なので待つ
    pendingFocusRef.current = false;
    document.getElementById("main")?.focus();
  }, [mobileDialogOpen, location.pathname]);

  // 目次を開いたまま広い画面になると、常時表示のサイドバーと本文の inert が食い違う
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      setIsMobile(!wide.matches);
      if (wide.matches) setOpen(false);
    };
    onChange();
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobileDialogOpen) return;
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
  }, [mobileDialogOpen]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        本文へ
      </a>
      {mobileDialogOpen ? (
        <button className="backdrop" type="button" aria-label="メニューを閉じる" onClick={() => setOpen(false)} />
      ) : null}
      <aside
        id="site-nav"
        ref={navRef}
        className={`sidebar ${mobileDialogOpen ? "open" : ""}`}
        aria-label="目次"
        role={mobileDialogOpen ? "dialog" : undefined}
        aria-modal={mobileDialogOpen ? true : undefined}
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
          <span className="brand-name">参画前に知っておきたい Java Web アプリ</span>
        </NavLink>

        <div className="nav-label">CONTENTS</div>
        {tracks.map((track) => {
          const expanded = expandedTrackIds.has(track.id);
          const lessonsId = `nav-lessons-${track.id}`;
          return (
            <div key={track.id} className="nav-group">
              <div className="nav-group-head">
                <button
                  type="button"
                  className={`nav-link nav-group-toggle-link ${currentTrackId === track.id ? "active" : ""}`}
                  aria-expanded={expanded}
                  aria-controls={lessonsId}
                  onClick={() => {
                    setExpandedTrackIds((current) => {
                      const next = new Set(current);
                      if (next.has(track.id)) next.delete(track.id);
                      else next.add(track.id);
                      return next;
                    });
                  }}
                >
                  <span className="no">{track.no}</span>
                  <span className="label" title={track.title}>
                    {track.title}
                  </span>
                  <span className="nav-group-caret" aria-hidden="true">
                    {expanded ? "−" : "＋"}
                  </span>
                </button>
              </div>
              {expanded ? (
                <div className="nav-lessons" id={lessonsId}>
                  {track.lessons.map((lesson) => (
                    <NavLink
                      key={lesson.id}
                      to={`/tracks/${track.id}/${lesson.id}`}
                      className={({ isActive }) => `nav-sub ${isActive ? "active" : ""}`}
                    >
                      <span className="nav-dot" />
                      {lesson.title}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="nav-label">LAB</div>
        <NavLink to="/lab" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
          <span className="no">
            <Icon name="lab" size={14} />
          </span>
          <span>ラボ</span>
        </NavLink>
        <div className="nav-label">GLOSSARY</div>
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
        <div className="nav-label">SAMPLE APP</div>
        <a className="nav-link" href="/downloads/shinsei-kun.zip" download onClick={() => setOpen(false)}>
          <span className="no">
            <Icon name="package" size={14} />
          </span>
          <span>申請くんのソース</span>
        </a>
        <div className="nav-label">LINKS</div>
        <a
          className="nav-link"
          href="https://monooki.kitchen1217.workers.dev/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <span className="no">
            <Icon name="link" size={14} />
          </span>
          <span>monooki</span>
        </a>
      </aside>

      <main className="main" id="main" tabIndex={-1} inert={mobileDialogOpen}>
        <header className="topbar">
          <button
            ref={toggleRef}
            className="btn btn-ghost mobile-toggle"
            type="button"
            aria-expanded={mobileDialogOpen}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            目次
          </button>
          <SiteSearch />
        </header>
        <Outlet />
      </main>
    </div>
  );
}
