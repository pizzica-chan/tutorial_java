import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { searchSite, type SearchHit } from "../lib/search";
import { Icon } from "./Icon";

export function SiteSearch() {
  const navigate = useNavigate();
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const hits = query.trim() ? searchSite(query) : [];
  const show = open && query.trim().length > 0;
  const showList = show && hits.length > 0;
  const showEmpty = show && hits.length === 0;
  const activeId = showList && hits[active] ? `${listId}-opt-${active}` : undefined;
  const statusId = `${listId}-status`;

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function go(hit: SearchHit) {
    setOpen(false);
    setQuery("");
    navigate(hit.href);
  }

  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (!show) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(hits.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      go(hits[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="site-search" ref={root}>
      <label className="sr-only" htmlFor="site-search-input">
        サイト内検索
      </label>
      <div className="search-field">
      <Icon name="search" className="search-icon" size={16} />
      <input
        id="site-search-input"
        type="search"
        role="combobox"
        placeholder="サイト内を検索"
        value={query}
        autoComplete="off"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={showList ? listId : undefined}
        aria-expanded={showList}
        aria-activedescendant={activeId}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
      />
      </div>
      {showList ? (
        <ul className="search-results" id={listId} role="listbox">
          {hits.map((hit, index) => (
            <li
              key={hit.href + hit.title}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? "active" : undefined}
              onMouseEnter={() => setActive(index)}
              onClick={() => go(hit)}
            >
              <span className="search-crumb">{hit.crumb}</span>
              <strong>{hit.title}</strong>
              <span className="search-snip">{hit.snippet}</span>
            </li>
          ))}
        </ul>
      ) : showEmpty ? (
        <p className="search-results search-empty" id={statusId} role="status" aria-live="polite">
          一致する項目はありません
        </p>
      ) : null}
    </div>
  );
}
