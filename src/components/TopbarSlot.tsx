import { createContext, useContext } from "react";

/** ページ側のボタンを、Layout のトップバー右端へ差し込むための置き場 */
export const TopbarSlotContext = createContext<HTMLElement | null>(null);

export function useTopbarSlot() {
  return useContext(TopbarSlotContext);
}
