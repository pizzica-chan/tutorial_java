import { createContext, useContext, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { splitByTerms, type TermDef } from "../data/terms";
import { glossaryAnchor } from "../data/terms";

const TermScopeContext = createContext<{ seen: Set<string>; once: boolean } | null>(null);

export function TermScope({ children, once = true }: { children: ReactNode; once?: boolean }) {
  const seen = new Set<string>();
  return <TermScopeContext.Provider value={{ seen, once }}>{children}</TermScopeContext.Provider>;
}

export function TextWithTerms({ text, highlight = true }: { text: string; highlight?: boolean }) {
  const scope = useContext(TermScopeContext);
  if (!highlight) return text;

  const once = scope?.once ?? false;
  const seen = scope?.seen;

  return (
    <>
      {splitByTerms(text).map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.value}</span>;
        }
        if (once && seen) {
          if (seen.has(part.def.term)) {
            return <span key={index}>{part.value}</span>;
          }
          seen.add(part.def.term);
        }
        return <TermMark key={index} def={part.def} text={part.value} />;
      })}
    </>
  );
}

function TermMark({ def, text }: { def: TermDef; text: string }) {
  const id = useId();
  const ref = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  function show() {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    const below = rect.bottom + 8;
    const top = below > window.innerHeight - 140 ? rect.top - 8 : below;
    setCoords({ top, left });
    setOpen(true);
  }

  return (
    <>
      <Link
        ref={ref}
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
                transform: coords.top < (ref.current?.getBoundingClientRect().top ?? 0) ? "translateY(-100%)" : undefined,
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
