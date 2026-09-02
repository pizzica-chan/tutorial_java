import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  kind?: "photo" | "screen";
  size?: "small";
};

export function ImageFigure({ src, alt, caption, kind, size }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const overlay = open
    ? createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button className="lightbox-close" type="button" aria-label="閉じる" onClick={() => setOpen(false)}>
            <Icon name="close" size={20} />
          </button>
          <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
        </div>,
        document.body,
      )
    : null;

  return (
    <figure
      className={[
        kind === "screen" ? "photo-figure screen-figure" : "photo-figure",
        size === "small" ? "screen-figure-small" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button type="button" className="figure-zoom" onClick={() => setOpen(true)} aria-label={`${alt}を拡大表示`}>
        <img src={src} alt={alt} loading="lazy" />
      </button>
      {caption ? (
        <figcaption>
          <TextWithTerms text={caption} />
        </figcaption>
      ) : null}
      {overlay}
    </figure>
  );
}
