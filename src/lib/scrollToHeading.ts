/** 利用者が自分でスクロールし始めたと見なすイベント */
export const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;

const GAP_BELOW_TOPBAR = 16;
const SETTLE_MS = 150;
const GIVE_UP_MS = 4000;

let cancelCurrent: (() => void) | null = null;

function topbarBottom() {
  return document.querySelector(".topbar")?.getBoundingClientRect().bottom ?? 0;
}

/**
 * 見出しを、トップバーの下端から少し空けた位置までスクロールする。
 * 画像は大きさを決めずに遅延読み込みしているので、スクロールの途中や後で上の高さが変わり、止まる位置がずれることがある。
 * Chrome はスクロール位置を自動で補正するが、補正しないブラウザもあるので、止まるたびに位置を確かめて合わせ直す。
 */
export function scrollToHeading(target: HTMLElement) {
  cancelCurrent?.();

  const offset = () => topbarBottom() + GAP_BELOW_TOPBAR;
  const destination = () => target.getBoundingClientRect().top + window.scrollY - offset();

  let settleTimer = 0;
  const realign = () => {
    if (Math.abs(target.getBoundingClientRect().top - offset()) > 1) {
      window.scrollTo({ top: destination(), behavior: "auto" });
    }
  };
  const scheduleRealign = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(realign, SETTLE_MS);
  };
  const resizeObserver = new ResizeObserver(scheduleRealign);

  const stop = () => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(giveUpTimer);
    resizeObserver.disconnect();
    window.removeEventListener("scroll", scheduleRealign);
    USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, stop));
    if (cancelCurrent === stop) cancelCurrent = null;
  };
  const giveUpTimer = window.setTimeout(stop, GIVE_UP_MS);

  window.addEventListener("scroll", scheduleRealign, { passive: true });
  USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }));
  resizeObserver.observe(document.body);
  cancelCurrent = stop;

  window.scrollTo({ top: destination(), behavior: "smooth" });
}
