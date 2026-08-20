import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, PenLine, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { StoredLetter } from '../types/data';
import './LetterMenu.css';

/** Actions for one scanned letter, behind a ⋮ button.
 *
 * Replying starts from the letter rather than from a blank form: the app has
 * already read who wrote in and what they want, and making someone type that
 * back in was asking them to do the work twice. Delete moves in here too —
 * it used to sit on the row as a bare bin icon next to a tappable card, one
 * mis-tap away from losing a letter. */
export function LetterMenu({ letter, childName, onDelete }: { letter: StoredLetter; childName?: string; onDelete: () => void }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  function reply() {
    setOpen(false);
    navigate('/reply', { state: { fromLetter: { analysis: letter.analysis, childName } } });
  }

  return (
    <div className="letter-menu" ref={ref}>
      <button
        className="letter-menu-btn"
        aria-label={t('letter_actions')}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreVertical size={17} strokeWidth={2} />
      </button>
      {open && (
        <div className="letter-menu-popup" onClick={(e) => e.stopPropagation()}>
          <button onClick={reply}>
            <PenLine size={16} strokeWidth={2} />
            {t('letter_action_reply')}
          </button>
          <button
            className="danger"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 size={16} strokeWidth={2} />
            {t('letter_delete')}
          </button>
        </div>
      )}
    </div>
  );
}
