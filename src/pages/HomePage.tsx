import { Link } from "react-router-dom";
import { tracks } from "../data/curriculum";
import { TextWithTerms } from "../components/TextWithTerms";
import { Icon, trackIcon } from "../components/Icon";

export function HomePage() {
  return (
    <div className="content">
      <div className="section-head">
        <h1>目次</h1>
      </div>
      <p className="lede">
        既存の Java Web アプリを、処理の入口から追い、リクエストがどこまで届いたかで切り分ける教材です。ゼロからアプリを作る入門ではありません。架空の申請アプリ「申請くん」を例に進めます。
      </p>
      <p>
        <Link to="/tracks/intro/about">この教材について →</Link>
      </p>
      <div className="grid">
        {tracks.map((track) => (
          <Link
            className="card"
            to={
              track.lessons.length === 1
                ? `/tracks/${track.id}/${track.lessons[0].id}`
                : `/tracks/${track.id}`
            }
            key={track.id}
            style={{ borderLeft: `3px solid ${track.accent}` }}
          >
            <div className="meta">
              <span className="card-kicker">
                <Icon name={trackIcon(track.id)} size={16} />
                {track.kicker}
              </span>
              <span>{track.no}</span>
            </div>
            <h3>{track.title}</h3>
            {track.description ? (
              <p>
                <TextWithTerms highlight={false} text={track.description} />
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
