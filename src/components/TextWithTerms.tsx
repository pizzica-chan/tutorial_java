import { useId, useState, type FocusEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { glossaryAnchor, splitByTerms, type TermDef } from "../data/terms";

export function TextWithTerms({ text, highlight = true }: { text: string; highlight?: boolean }) {
  if (!highlight) return text;

  return (
    <>
      {splitByTerms(text).map((part, index) =>
        part.type === "text" ? (
          <span key={index}>{part.value}</span>
        ) : (
          <TermMark key={index} def={part.def} text={part.value} />
        ),
      )}
    </>
  );
}

function TermMark({ def, text }: { def: TermDef; text: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, flip: false });

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

  return (
    <>
      <Link
        className="term"
        to={`/glossary#${glossaryAnchor(def.term)}`}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
      >
        {text}
      </Link>
      {open
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
        : null}
    </>
  );
}
