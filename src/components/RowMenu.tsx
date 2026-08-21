import { useEffect, useRef, useState, type ReactNode } from 'react';
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

/** The ⋮ affordance shared by letters and appointments.
 *
 * Both rows are fully tappable cards, so anything actionable on them either
 * hides behind this or risks being hit on the way to opening the row —
 * which is how deleting used to work. */
export function RowMenu({ items, label }: { items: RowMenuItem[]; label?: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // A menu that survives a tap elsewhere reads as stuck, so close on any
  // outside pointer-down and on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="row-menu" ref={ref}>
      <button
        className="row-menu-btn"
        aria-label={label ?? t('row_actions')}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreVertical size={17} strokeWidth={2} />
      </button>
      {open && (
        <div className="row-menu-popup" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}
    </div>
  );
}
