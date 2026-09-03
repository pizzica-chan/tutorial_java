import { useEffect, useRef, useState } from "react";
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

type Point = { x: number; y: number };

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DISTANCE = 30;
const DRAG_THRESHOLD = 6;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ImageFigure({ src, alt, caption, kind, size }: Props) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const [fittedSize, setFittedSize] = useState<{ width: number; height: number } | null>(null);
  const [overflowsAtBaseline, setOverflowsAtBaseline] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  const fittedSizeRef = useRef(fittedSize);
  scaleRef.current = scale;
  panRef.current = pan;
  fittedSizeRef.current = fittedSize;

  const pointersRef = useRef(new Map<number, Point>());
  const pinchStateRef = useRef<{ startDistance: number; startScale: number; q: Point; center: Point } | null>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number; moved: boolean } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);

  function close() {
    setOpen(false);
    setScale(1);
    setPan({ x: 0, y: 0 });
    setFittedSize(null);
    setOverflowsAtBaseline(false);
    pointersRef.current.clear();
    pinchStateRef.current = null;
    dragStateRef.current = null;
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const img = imgRef.current;
    if (!img) return;
    // 実寸表示前の「フィット時サイズ」を一度だけ測る。以降はこの値 × scale を
    // 実際の width/height に反映し、拡大を transform:scale ではなく再サンプリングさせる
    function measure() {
      if (!img) return;
      const width = img.offsetWidth;
      const height = img.offsetHeight;
      setFittedSize({ width, height });
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        setOverflowsAtBaseline(height > containerRect.height || width > containerRect.width);
      }
    }
    if (img.complete) {
      measure();
    } else {
      img.addEventListener("load", measure, { once: true });
      return () => img.removeEventListener("load", measure);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function getCenter(): Point {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function clampPan(candidate: Point, atScale: number): Point {
    const fitted = fittedSizeRef.current;
    const container = containerRef.current;
    if (!fitted || !container) return candidate;
    const containerRect = container.getBoundingClientRect();
    const displayedWidth = fitted.width * atScale;
    const displayedHeight = fitted.height * atScale;
    const maxX = Math.max(0, (displayedWidth - containerRect.width) / 2);
    const maxY = Math.max(0, (displayedHeight - containerRect.height) / 2);
    return { x: clamp(candidate.x, -maxX, maxX), y: clamp(candidate.y, -maxY, maxY) };
  }

  function toggleZoomAt(point: Point) {
    const center = getCenter();
    setTransitionEnabled(true);
    if (scaleRef.current > 1.01) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      return;
    }
    const target = DOUBLE_TAP_SCALE;
    const q: Point = {
      x: center.x + (point.x - center.x - panRef.current.x) / scaleRef.current,
      y: center.y + (point.y - center.y - panRef.current.y) / scaleRef.current,
    };
    const nextPan: Point = {
      x: point.x - center.x - target * (q.x - center.x),
      y: point.y - center.y - target * (q.y - center.y),
    };
    setScale(target);
    setPan(clampPan(nextPan, target));
  }

  function handleTap(point: Point) {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && now - last.time < DOUBLE_TAP_MS && distance(point, last) < DOUBLE_TAP_DISTANCE) {
      lastTapRef.current = null;
      toggleZoomAt(point);
    } else {
      lastTapRef.current = { time: now, x: point.x, y: point.y };
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLImageElement>) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // ブラウザによっては無効な pointerId で例外になることがあるが、
      // キャプチャできなくても以降の追跡には支障が無い
    }
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setTransitionEnabled(false);

    if (pointersRef.current.size === 1) {
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
        moved: false,
      };
    } else if (pointersRef.current.size === 2) {
      const [p1, p2] = Array.from(pointersRef.current.values());
      const center = getCenter();
      const mid = midpoint(p1, p2);
      const q: Point = {
        x: center.x + (mid.x - center.x - panRef.current.x) / scaleRef.current,
        y: center.y + (mid.y - center.y - panRef.current.y) / scaleRef.current,
      };
      pinchStateRef.current = { startDistance: distance(p1, p2), startScale: scaleRef.current, q, center };
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLImageElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size >= 2 && pinchStateRef.current) {
      const [p1, p2] = Array.from(pointersRef.current.values());
      const { startDistance, startScale, q, center } = pinchStateRef.current;
      const newDistance = distance(p1, p2);
      const newMid = midpoint(p1, p2);
      const newScale = clamp(startScale * (newDistance / startDistance), 1, MAX_SCALE);
      const nextPan: Point = {
        x: newMid.x - center.x - newScale * (q.x - center.x),
        y: newMid.y - center.y - newScale * (q.y - center.y),
      };
      setScale(newScale);
      setPan(clampPan(nextPan, newScale));
      if (dragStateRef.current) dragStateRef.current.moved = true;
      return;
    }

    if (pointersRef.current.size === 1 && dragStateRef.current) {
      const dx = event.clientX - dragStateRef.current.startX;
      const dy = event.clientY - dragStateRef.current.startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        dragStateRef.current.moved = true;
      }
      // 幅いっぱいの初期表示でも、縦に画面をはみ出す画像はここでドラッグ移動できる。
      // はみ出していない軸は clampPan が 0 に固定する
      const nextPan: Point = {
        x: dragStateRef.current.startPanX + dx,
        y: dragStateRef.current.startPanY + dy,
      };
      setPan(clampPan(nextPan, scaleRef.current));
    }
  }

  function endPointer(event: React.PointerEvent<HTMLImageElement>) {
    const wasSingle = pointersRef.current.size === 1;
    const dragInfo = dragStateRef.current;
    pointersRef.current.delete(event.pointerId);

    if (pointersRef.current.size < 2) pinchStateRef.current = null;

    if (pointersRef.current.size === 1) {
      const [remaining] = Array.from(pointersRef.current.values());
      dragStateRef.current = {
        startX: remaining.x,
        startY: remaining.y,
        startPanX: panRef.current.x,
        startPanY: panRef.current.y,
        moved: true,
      };
    } else if (pointersRef.current.size === 0) {
      dragStateRef.current = null;
      if (wasSingle && dragInfo && !dragInfo.moved) {
        handleTap({ x: event.clientX, y: event.clientY });
      }
    }
  }

  const overlay = open
    ? createPortal(
        <div className="lightbox" ref={containerRef} role="dialog" aria-modal="true" aria-label={alt} onClick={() => close()}>
          <button className="lightbox-close" type="button" aria-label="閉じる" onClick={() => close()}>
            <Icon name="close" size={20} />
          </button>
          <div className="lightbox-frame">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="lightbox-img"
              style={{
                ...(fittedSize ? { width: fittedSize.width * scale, height: fittedSize.height * scale } : {}),
                transform: `translate(${pan.x}px, ${pan.y}px)`,
                transition: transitionEnabled ? "width 0.2s ease, height 0.2s ease, transform 0.2s ease" : "none",
                cursor: scale > 1 || overflowsAtBaseline ? "grab" : "zoom-in",
                touchAction: "none",
              }}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endPointer}
              onPointerCancel={endPointer}
            />
          </div>
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
