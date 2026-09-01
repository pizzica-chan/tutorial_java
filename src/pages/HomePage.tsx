import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { tracks } from "../data/curriculum";
import { TextWithTerms } from "../components/TextWithTerms";
import { Icon, trackIcon } from "../components/Icon";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function TrackRow({ track, index }: { track: (typeof tracks)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLAnchorElement>();
  const to =
    track.lessons.length === 1
      ? `/tracks/${track.id}/${track.lessons[0].id}`
      : `/tracks/${track.id}`;

  return (
    <Link
      ref={ref}
      to={to}
      className={`track-row ${visible ? "is-visible" : ""}`}
      style={{
        ["--track-accent" as string]: track.accent,
        transitionDelay: `${Math.min(index, 6) * 60}ms`,
      }}
    >
      <span className="track-row-no">{track.no}</span>
      <span className="track-row-icon">
        <Icon name={trackIcon(track.id)} size={26} />
      </span>
      <span className="track-row-body">
        <span className="card-kicker track-row-kicker">{track.kicker}</span>
        <h2 className="track-row-title">{track.title}</h2>
        {track.description ? (
          <p className="track-row-desc">
            <TextWithTerms highlight={false} text={track.description} />
          </p>
        ) : null}
      </span>
      <span className="track-row-arrow" aria-hidden="true">
        <Icon name="arrow-right" size={20} />
      </span>
    </Link>
  );
}

export function HomePage() {
  return (
    <div className="content home-content">
      <section className="home-hero">
        <div className="home-hero-shape" aria-hidden="true" />
        <div className="section-head">
          <h1>目次</h1>
        </div>
        <p className="lede home-lede">
          既存の Java Web アプリを、処理の入口から追い、リクエストがどこまで届いたかで切り分ける教材です。ゼロからアプリを作る入門ではありません。架空の申請アプリ「申請くん」を例に進めます。
        </p>
        <Link to="/tracks/intro/about" className="btn btn-primary home-hero-cta">
          この教材について
          <Icon name="arrow-right" size={16} />
        </Link>
      </section>

      <div className="track-rows">
        {tracks.map((track, index) => (
          <TrackRow track={track} index={index} key={track.id} />
        ))}
      </div>
    </div>
  );
}
