import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { useTopbarSlot } from "./TopbarSlot";

const NARROW_QUERY = "(max-width: 900px)";

/**
 * 右側の目次。広い画面では本文の横に置き、狭い画面ではトップバー右端のボタンで開閉する。
 * 同じリストを2か所に描くので、リンクの動きは children 側に持たせる。
 */
export function PageToc({
  label,
  ariaLabel,
  className,
  children,
}: {
  label: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const slot = useTopbarSlot();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const navClass = className ? `article-toc ${className}` : "article-toc";

  // 開いたまま広い画面になると、隠れたパネルの開いた状態だけが残る
  useEffect(() => {
    const narrow = window.matchMedia(NARROW_QUERY);
    const onChange = () => {
      if (!narrow.matches) setOpen(false);
    };
    narrow.addEventListener("change", onChange);
    return () => narrow.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as Element).closest("a")) setOpen(false);
  }

  return (
    <>
      <nav className={navClass} aria-label={ariaLabel}>
        <p className="article-toc-label">{label}</p>
        {children}
      </nav>
      {slot
        ? createPortal(
            <div className="toc-menu">
              <button
                ref={buttonRef}
                className="btn btn-ghost toc-toggle"
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
              >
                <Icon name={open ? "close" : "list"} size={18} />
                <span className="sr-only">{label}</span>
              </button>
              <nav
                id={panelId}
                ref={panelRef}
                className={`${navClass} toc-panel`}
                aria-label={ariaLabel}
                hidden={!open}
                onClick={closeOnLink}
              >
                <p className="article-toc-label">{label}</p>
                {children}
              </nav>
            </div>,
            slot,
          )
        : null}
    </>
  );
}
