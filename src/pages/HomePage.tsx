import { Link } from "react-router-dom";
import { tracks, totalLessons, firstLessonPath } from "../data/curriculum";
import { continueHref, hasStarted } from "../lib/progress";
import { useProgress } from "../hooks/useProgress";
import { TextWithTerms } from "../components/TextWithTerms";
import { Icon, trackIcon } from "../components/Icon";

export function HomePage() {
  const completed = useProgress();
  const resume = hasStarted(completed) ? continueHref(completed) : undefined;

  return (
    <div className="content">
      <section className="hero">
        <p className="kicker">既存コード / 切り分け</p>
        <h1>基礎知識と、症状別の切り分け。</h1>
        <p className="lede">
          <TextWithTerms
            highlight={false}
            text="HTTP と Java Web アプリの構成、既存コードの追い方、よくある不具合パターン、シナリオでの切り分け。ゼロからアプリを作る教材ではありません。コード例は架空の社内申請アプリ「申請くん」です。"
          />
        </p>
        <div className="hero-actions">
          {resume ? (
            <Link className="btn btn-primary" to={resume}>
              続きから
            </Link>
          ) : (
            <Link className="btn btn-primary" to={firstLessonPath("intro")}>
              はじめにから始める
            </Link>
          )}
          <Link className="btn btn-ghost" to={resume ? firstLessonPath("intro") : "/tracks/troubleshoot"}>
            {resume ? "最初から" : "経験者向け: パターン別へ"}
          </Link>
        </div>
        <div className="stats">
          <div className="stat">
            <b>{tracks.length}</b>
            <span>章</span>
          </div>
          <div className="stat">
            <b>{totalLessons}</b>
            <span>項目</span>
          </div>
          <div className="stat">
            <b>{completed.length}</b>
            <span>読了</span>
          </div>
        </div>
      </section>

      <div className="section-head">
        <h2>目次</h2>
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
            <p>
              <TextWithTerms highlight={false} text={track.description} />
            </p>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>コード例：申請くん</h2>
      </div>
      <p>
        <TextWithTerms
          highlight={false}
          text="架空の社内向け申請アプリです。社員が申請を出し、承認者が承認する、という想定です。実在しません。"
        />
      </p>
      <p>
        <TextWithTerms
          highlight={false}
          text="構成は Spring Boot、Thymeleaf、MyBatis、MySQL、Spring Security。以降の URL、ソース、ログはこのアプリの話です。"
        />
      </p>
      <p>
        <Link className="btn btn-ghost" to="/lab">
          ラボでソースを開く
        </Link>
      </p>
    </div>
  );
}
