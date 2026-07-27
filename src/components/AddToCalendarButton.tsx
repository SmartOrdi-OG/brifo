import type { MouseEvent } from 'react';
import { CalendarPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { downloadIcsEvent } from '../lib/ics';
import './AddToCalendarButton.css';

interface AddToCalendarButtonProps {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM (24-hour), optional — omit for an all-day event. */
  time?: string;
  /** Icon-only pill for tight layouts (e.g. horizontal deadline chips). */
  compact?: boolean;
}

export function AddToCalendarButton({ title, date, time, compact }: AddToCalendarButtonProps) {
  const { t } = useLanguage();

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    downloadIcsEvent({ title, date, time });
  }

  if (compact) {
    return (
      <button className="ics-btn ics-btn-compact" onClick={handleClick} aria-label={t('add_to_calendar')}>
        <CalendarPlus size={15} strokeWidth={2.25} />
      </button>
    );
  }

  return (
    <button className="ics-btn" onClick={handleClick}>
      <CalendarPlus size={15} strokeWidth={2.25} />
      <span>{t('add_to_calendar')}</span>
    </button>
  );
}
