import { useEffect, useId, useState, type FocusEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { glossaryAnchor, type TermDef } from "../data/terms";

type Props = {
  def: TermDef;
  text: string;
  className?: string;
  /** 用語集への Tab 止めにする。false でもリンクのまま（tabIndex=-1） */
  toGlossary?: boolean;
};

export function TermMark({ def, text, className, toGlossary = true }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, flip: false });
  const href = `/glossary#${glossaryAnchor(def.term)}`;
  const classNames = className ? `term ${className}` : "term";

  function show(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    const below = rect.bottom + 8;
    const flip = below > window.innerHeight - 140;
    setCoords({ top: flip ? rect.top - 8 : below, left, flip });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const tip = open
    ? createPortal(
        <span
          id={id}
          className="term-tip"
          role="tooltip"
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.flip ? "translateY(-100%)" : undefined,
          }}
        >
          <strong>{def.term}</strong>
          {def.body}
        </span>,
        document.body,
      )
    : null;

  return (
    <>
      <Link
        className={classNames}
        to={href}
        tabIndex={toGlossary ? undefined : -1}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
      >
        {text}
      </Link>
      {tip}
    </>
  );
}
