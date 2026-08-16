import { useCallback, useRef, type KeyboardEvent } from "react";

/**
 * WAI-ARIA の Tabs に必要な矢印キー移動を足す。
 * タブ自体の tabIndex は選択中だけ 0 にして、Tab キーではタブ列を素通りさせる。
 */
export function useTabList(count: number, active: number, onChange: (index: number) => void) {
  const listRef = useRef<HTMLDivElement>(null);

  const move = useCallback((index: number) => {
    onChange(index);
    const tabs = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[index]?.focus();
  }, [onChange]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (count === 0) return;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          move((active + 1) % count);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          move((active - 1 + count) % count);
          break;
        case "Home":
          event.preventDefault();
          move(0);
          break;
        case "End":
          event.preventDefault();
          move(count - 1);
          break;
        default:
          break;
      }
    },
    [active, count, move],
  );

  return { listRef, onKeyDown };
}

export function tabProps(prefix: string, index: number, selected: boolean) {
  return {
    role: "tab" as const,
    id: `${prefix}-tab-${index}`,
    "aria-selected": selected,
    "aria-controls": `${prefix}-panel-${index}`,
    tabIndex: selected ? 0 : -1,
  };
}

// パネル内には用語リンクやコードの操作があるので、パネル自体は tabindex を持たせない
export function tabPanelProps(prefix: string, index: number) {
  return {
    role: "tabpanel" as const,
    id: `${prefix}-panel-${index}`,
    "aria-labelledby": `${prefix}-tab-${index}`,
  };
}
