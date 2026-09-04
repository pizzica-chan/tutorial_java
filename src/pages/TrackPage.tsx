import { Link, useParams } from "react-router-dom";
import { getTrack, lessonLead } from "../data/curriculum";
import { NotFoundPage } from "./NotFoundPage";
import { TextWithTerms } from "../components/TextWithTerms";
import { Icon } from "../components/Icon";
import { lessonRowAnchor } from "../lib/anchors";
import { useHashTarget } from "../hooks/useHashTarget";

export function TrackPage() {
  const { trackId } = useParams();
  useHashTarget();
  const track = getTrack(trackId);

  if (!track) {
    return <NotFoundPage title="章が見つかりません" />;
  }

  return (
    <div className="content">
      <p className="crumb">
        <Link to="/">トップ</Link> / {track.title}
      </p>
      <p className="kicker">{track.kicker}</p>
      <h1 className="serif page-title">
        {track.no} {track.title}
      </h1>
      {track.description ? (
        <p className="lede">
          <TextWithTerms highlight={false} text={track.description} />
        </p>
      ) : null}
      <div className="lesson-list" style={{ marginTop: 28 }}>
        {track.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            id={lessonRowAnchor(lesson.id)}
            className="lesson-row"
            to={`/tracks/${track.id}/${lesson.id}`}
          >
            <div>
              <strong>
                {String(index + 1).padStart(2, "0")} {lesson.title}
              </strong>
              <p className="lesson-lead">{lessonLead(lesson)}</p>
            </div>
            <span className="lesson-mins">
              <Icon name="clock" size={14} />
              {lesson.minutes} min
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
