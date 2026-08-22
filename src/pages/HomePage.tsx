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
      <div className="grid">
        {tracks.map((track) => (
          <Link
            className="card"
            to={`/tracks/${track.id}`}
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
