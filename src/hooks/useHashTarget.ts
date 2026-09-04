import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HIGHLIGHT_MS = 2400;

/**
 * URL のハッシュが指す要素まで移動し、少しのあいだ目印を付ける。
 * サイト内検索から一致した箇所へ飛ぶときに使う。
 */
export function useHashTarget() {
  const location = useLocation();

  useEffect(() => {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    // フォーカスを受け取れる要素なら、読み上げの位置も合わせる
    if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
    target.classList.add("is-hash-target");
    const timer = window.setTimeout(() => target.classList.remove("is-hash-target"), HIGHLIGHT_MS);

    return () => {
      window.clearTimeout(timer);
      target.classList.remove("is-hash-target");
    };
    // location.key も見て、同じハッシュを選び直したときにもう一度動くようにする
  }, [location.pathname, location.hash, location.key]);
}
