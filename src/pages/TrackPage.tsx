import { Link, useParams } from "react-router-dom";
import { getTrack } from "../data/curriculum";
import { NotFoundPage } from "./NotFoundPage";
import { lessonKey } from "../lib/progress";
import { useProgress } from "../hooks/useProgress";
import { TextWithTerms } from "../components/TextWithTerms";
import { Icon } from "../components/Icon";

export function TrackPage() {
  const { trackId } = useParams();
  const track = getTrack(trackId);
  const completed = useProgress();

  if (!track) {
    return <NotFoundPage title="章が見つかりません" />;
  }

  return (
    <div className="content">
      <p className="crumb">
        <Link to="/">トップ</Link> / {track.title}
      </p>
      <p className="kicker">{track.kicker}</p>
      <h1 className="serif" style={{ fontSize: 42, marginTop: 8 }}>
        {track.no} {track.title}
      </h1>
      <p className="lede">
        <TextWithTerms highlight={false} text={track.description} />
      </p>
      <div className="lesson-list" style={{ marginTop: 28 }}>
        {track.lessons.map((lesson, index) => {
          const done = completed.includes(lessonKey(track.id, lesson.id));
          return (
            <Link
              key={lesson.id}
              className={`lesson-row ${done ? "done" : ""}`}
              to={`/tracks/${track.id}/${lesson.id}`}
            >
              <span className="check">{done ? <Icon name="check" size={12} /> : null}</span>
              <div>
                <strong>
                  {String(index + 1).padStart(2, "0")} {lesson.title}
                </strong>
              </div>
              <span className="lesson-mins">
                <Icon name="clock" size={14} />
                {lesson.minutes} min
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
