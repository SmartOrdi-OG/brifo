import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './RowMenu.css';

export interface RowMenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  danger?: boolean;
}

const GAP = 6;
const EDGE = 8;
/** The bottom tab bar is fixed over the page, so a menu that merely fits the
 * viewport can still land on top of it. Flip up before reaching it. */
const BOTTOM_EDGE = 96;

/** The ⋮ affordance shared by letters and appointments.
 *
 * Both rows are fully tappable cards, so anything actionable on them either
 * hides behind this or risks being hit on the way to opening the row.
 *
 * The popup is portalled to <body> and positioned fixed rather than absolutely
 * inside the row. The upcoming-appointments strip scrolls horizontally, and an
 * absolutely-positioned child of an `overflow: auto` box is clipped by it —
 * the menu came out sliced in half. Fixed also escapes any stacking context a
 * card might create. */
export function RowMenu({ items, label }: { items: RowMenuItem[]; label?: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Measured after the popup renders, so the flip-up and the edge clamp use
  // its real size rather than a guess at the row height.
  useLayoutEffect(() => {
    if (!open) return;
    const btn = btnRef.current?.getBoundingClientRect();
    const menu = popupRef.current?.getBoundingClientRect();
    if (!btn || !menu) return;
    const below = btn.bottom + GAP;
    const top =
      below + menu.height > window.innerHeight - BOTTOM_EDGE ? Math.max(EDGE, btn.top - menu.height - GAP) : below;
    const left = Math.max(EDGE, Math.min(btn.right - menu.width, window.innerWidth - menu.width - EDGE));
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || popupRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    // A fixed popup can't follow the row it belongs to, so rather than let it
    // drift away from its button, scrolling dismisses it.
    function close() {
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <div className="row-menu">
      <button
        ref={btnRef}
        className="row-menu-btn"
        aria-label={label ?? t('row_actions')}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setPos(null);
          setOpen((v) => !v);
        }}
      >
        <MoreVertical size={17} strokeWidth={2} />
      </button>
      {open &&
        createPortal(
          <div
            ref={popupRef}
            className="row-menu-popup"
            // Hidden for the single frame between rendering and being measured,
            // so it never flashes in the top-left corner first.
            style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => (
              <button
                key={item.key}
                className={item.danger ? 'danger' : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
