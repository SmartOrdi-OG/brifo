import { X, CalendarClock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useBidiText } from '../lib/bidiText';
import { isUpcoming, localDateKey } from '../lib/eventTime';
import './RemindersPanel.css';

interface RemindersPanelProps {
  onClose: () => void;
}

export function RemindersPanel({ onClose }: RemindersPanelProps) {
  const { t } = useLanguage();
  const bidi = useBidiText();
  const { children, events } = useData();

  const now = new Date();
  const today = localDateKey(now);
  const horizon = localDateKey(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000));
  // isUpcoming, not `date >= today`: this panel answers "what is coming", and
  // a date-only comparison kept an appointment on the list all day after it
  // had already happened.
  const upcoming = events
    .filter((e) => isUpcoming(e, now) && e.date <= horizon)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''));

  function childFor(childId: string) {
    return children.find((c) => c.id === childId);
  }

  return (
    <>
      <div className="reminders-backdrop" onClick={onClose} />
      <div className="reminders-panel card">
        <div className="reminders-panel-head">
          <h3>{t('reminders_panel_title')}</h3>
          <button className="reminders-close" onClick={onClose} aria-label={t('back')}>
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="reminders-empty">
            <CalendarClock size={22} strokeWidth={2} />
            <p>{t('reminders_empty')}</p>
          </div>
        ) : (
          <div className="reminders-list">
            {upcoming.map((e) => {
              const child = childFor(e.childId);
              return (
                <div className="reminders-item" key={e.id}>
                  <span className="reminders-date nums">{e.date === today ? t('reminders_today') : e.date}</span>
                  <div className="reminders-item-info">
                    <h4>{bidi(e.title)}</h4>
                    <p>{bidi(child ? child.name : t('assign_all_children'))}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
