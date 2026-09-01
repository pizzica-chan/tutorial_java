import { Link, useParams } from "react-router-dom";
import { getLesson } from "../data/curriculum";
import { NotFoundPage } from "./NotFoundPage";
import { Article } from "../components/Article";
import { ArticleToc } from "../components/ArticleToc";
import { Icon } from "../components/Icon";
import { extractHeadings } from "../lib/headings";

export function LessonPage() {
  const { trackId, lessonId } = useParams();
  const found = getLesson(trackId, lessonId);

  if (!found) {
    return <NotFoundPage title="項目が見つかりません" />;
  }

  const { track, lesson, prev, next } = found;
  const headings = extractHeadings(lesson.blocks);

  return (
    <div className="content">
      <ArticleToc headings={headings} />
      <p className="crumb">
        <Link to="/">トップ</Link> / <Link to={`/tracks/${track.id}`}>{track.title}</Link> / {lesson.title}
      </p>
      <p className="kicker">
        {track.kicker} · {lesson.minutes} min
      </p>
      <h1 className="serif page-title">{lesson.title}</h1>
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
