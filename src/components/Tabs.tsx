"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

export interface TabsProps {
  tabs: [TabItem, TabItem];
  initialTabId?: string;
}

export function Tabs({ tabs, initialTabId }: TabsProps) {
  const [activeId, setActiveId] = useState(initialTabId ?? tabs[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);

  function focusTabAt(index: number) {
    const wrapped = (index + tabs.length) % tabs.length;
    const nextTab = tabs[wrapped];
    setActiveId(nextTab.id);
    tabRefs.current[wrapped]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTabAt(activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTabAt(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTabAt(0);
        break;
      case "End":
        event.preventDefault();
        focusTabAt(tabs.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="온결 공방 주요 메뉴"
        className="flex gap-2 border-b border-border"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={handleKeyDown}
              className={
                selected
                  ? "px-4 py-3 font-serif text-[16px] font-medium text-ink-point border-b-2 border-ink-point -mb-px"
                  : "px-4 py-3 font-serif text-[16px] font-medium text-ink-soft hover:text-ink"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          tabIndex={0}
          className="pt-6"
        >
          {tab.id === activeId ? tab.panel : null}
        </div>
      ))}
    </div>
  );
}
