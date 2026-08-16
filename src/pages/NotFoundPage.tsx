import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="content">
      <p className="kicker">404</p>
      <h1 className="serif" style={{ fontSize: 42, marginTop: 8 }}>
        ページが見つかりません
      </h1>
      <p className="lede">アドレスが違うか、古いリンクの可能性があります。</p>
      <p>
        <Link className="btn btn-primary" to="/">
          トップへ戻る
        </Link>
      </p>
    </div>
  );
}
