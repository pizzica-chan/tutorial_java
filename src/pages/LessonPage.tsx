import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getLesson } from "../data/curriculum";
import { NotFoundPage } from "./NotFoundPage";
import { lessonKey, setLastLesson, toggleCompleted } from "../lib/progress";
import { Article } from "../components/Article";
import { Icon } from "../components/Icon";
import { useProgress } from "../hooks/useProgress";

export function LessonPage() {
  const { trackId, lessonId } = useParams();
  const found = getLesson(trackId, lessonId);
  const completed = useProgress();

  useEffect(() => {
    if (!trackId || !lessonId) return;
    if (!getLesson(trackId, lessonId)) return;
    setLastLesson(trackId, lessonId);
  }, [trackId, lessonId]);

  if (!found) {
    return <NotFoundPage title="項目が見つかりません" />;
  }

  const { track, lesson, prev, next } = found;
  const key = lessonKey(track.id, lesson.id);
  const done = completed.includes(key);

  return (
    <div className="content">
      <p className="crumb">
        <Link to="/">トップ</Link> / <Link to={`/tracks/${track.id}`}>{track.title}</Link> / {lesson.title}
      </p>
      <p className="kicker">
        {track.kicker} · {lesson.minutes} min
      </p>
      <h1 className="serif" style={{ fontSize: 40, marginTop: 8 }}>
        {lesson.title}
      </h1>
      <Article blocks={lesson.blocks} />
      <div className="pager">
        {prev ? (
          <Link className="btn btn-ghost" to={`/tracks/${prev.trackId}/${prev.id}`}>
            <Icon name="arrow-left" size={16} />
            {prev.title}
          </Link>
        ) : (
          <Link className="btn btn-ghost" to={`/tracks/${track.id}`}>
            <Icon name="arrow-left" size={16} />
            目次へ
          </Link>
        )}
        <button className={`btn ${done ? "btn-ghost" : "btn-primary"}`} type="button" onClick={() => toggleCompleted(key)}>
          {done ? "読了を解除" : "読了にする"}
        </button>
        {next ? (
          <Link className="btn btn-ghost" to={`/tracks/${next.trackId}/${next.id}`}>
            {next.title}
            <Icon name="arrow-right" size={16} />
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/lab">
            ラボへ
            <Icon name="arrow-right" size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
