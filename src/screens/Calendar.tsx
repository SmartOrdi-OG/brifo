import { useState } from 'react';
import { CalendarX2, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { TabLayout } from '../components/TabLayout';
import { Header } from '../components/Header';
import { AddToCalendarButton } from '../components/AddToCalendarButton';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ALL_CHILDREN, type CalendarEvent } from '../types/data';
import { isolateBidiRuns } from '../lib/bidiText';
import { colorsForChildId, dotBackground } from '../lib/childColors';
import type { TranslationKey } from '../context/translations';
import './Calendar.css';

const SOURCE_LABEL_KEY = {
  letter: 'calendar_source_letter',
  payment: 'calendar_source_payment',
  manual: 'calendar_source_manual',
} as const;

const WEEKDAY_KEYS: TranslationKey[] = [
  'weekday_mon',
  'weekday_tue',
  'weekday_wed',
  'weekday_thu',
  'weekday_fri',
  'weekday_sat',
  'weekday_sun',
];

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `d`. */
function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay(); // 0 = Sunday .. 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** 0 = Monday .. 6 = Sunday, to match WEEKDAY_KEYS order. */
function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function Calendar() {
  const { t, dir } = useLanguage();
  const { children, events, addManualEvent, updateEvent, deleteEvent } = useData();

  const [viewMode, setViewMode] = useState<'list' | 'week' | 'day'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [childId, setChildId] = useState<string>(ALL_CHILDREN);

  const now = new Date();
  const today = toIsoDate(now);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(now));
  const [dayCursor, setDayCursor] = useState<Date>(now);

  const upcoming = events
    .filter((e) => e.date >= today)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
  const expired = events
    .filter((e) => e.date < today)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function childFor(id: string) {
    return children.find((c) => c.id === id);
  }

  function renderRow(e: CalendarEvent, showDate = true) {
    const child = childFor(e.childId);
    return (
      <div className="card calendar-row" key={e.id}>
        <span className="calendar-dot" style={{ background: dotBackground(colorsForChildId(e.childId, children)) }} />
        <div className="calendar-info">
          <h4>{isolateBidiRuns(e.title)}</h4>
          <p>
            {showDate && (
              <>
                <span className="nums">{e.date}</span> ·{' '}
              </>
            )}
            {isolateBidiRuns(
              child ? (child.schoolClass ? `${child.name} (${child.schoolClass})` : child.name) : t('assign_all_children'),
            )}
          </p>
        </div>
        <span className="calendar-source">{t(SOURCE_LABEL_KEY[e.source])}</span>
        <AddToCalendarButton title={e.title} date={e.date} compact />
        <button className="calendar-edit" onClick={() => startEdit(e)} aria-label={t('calendar_edit_event')}>
          <Pencil size={16} strokeWidth={2} />
        </button>
        <button className="calendar-delete" onClick={() => deleteEvent(e.id)} aria-label={t('calendar_delete_event')}>
          <Trash2 size={16} strokeWidth={2} />
        </button>
      </div>
    );
  }

  function startEdit(e: CalendarEvent) {
    setEditingId(e.id);
    setTitle(e.title);
    setDate(e.date);
    setChildId(e.childId);
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setDate('');
    setChildId(ALL_CHILDREN);
    setShowForm(false);
  }

  function openFormForDate(iso: string) {
    setEditingId(null);
    setTitle('');
    setDate(iso);
    setChildId(ALL_CHILDREN);
    setShowForm(true);
  }

  function submit() {
    if (!title.trim() || !date) return;
    if (editingId) {
      updateEvent(editingId, { childId, title: title.trim(), date });
    } else {
      addManualEvent(childId, title.trim(), date);
    }
    resetForm();
  }

  function goPrevWeek() {
    setWeekStart((prev) => addDays(prev, -7));
  }

  function goNextWeek() {
    setWeekStart((prev) => addDays(prev, 7));
  }

  function goCurrentWeek() {
    setWeekStart(startOfWeek(new Date()));
  }

  function goPrevDay() {
    setDayCursor((prev) => addDays(prev, -1));
  }

  function goNextDay() {
    setDayCursor((prev) => addDays(prev, 1));
  }

  function goToday() {
    setDayCursor(new Date());
  }

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <TabLayout>
      <Header />
      <div className="sec">
        <h3>{t('screen_calendar')}</h3>
        <a onClick={() => (showForm ? resetForm() : setShowForm(true))}>{t('calendar_add_event')}</a>
      </div>

      <div className="calendar-view-toggle">
        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
          {t('calendar_view_list')}
        </button>
        <button className={viewMode === 'week' ? 'active' : ''} onClick={() => setViewMode('week')}>
          {t('calendar_view_week')}
        </button>
        <button className={viewMode === 'day' ? 'active' : ''} onClick={() => setViewMode('day')}>
          {t('calendar_view_day')}
        </button>
      </div>

      {showForm && (
        <div className="card event-form">
          <div className="field">
            <label>{t('calendar_event_title_label')}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('calendar_event_title_placeholder')} />
          </div>
          <div className="field">
            <label>{t('calendar_event_date_label')}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('calendar_event_child_label')}</label>
            <select value={childId} onChange={(e) => setChildId(e.target.value)}>
              <option value={ALL_CHILDREN}>{t('assign_all_children')}</option>
              {children.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.schoolClass ? `${c.name} (${c.schoolClass})` : c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="event-form-actions">
            <button className="scan-btn" onClick={resetForm}>
              {t('cancel')}
            </button>
            <button className="scan-btn primary" onClick={submit}>
              {t('save')}
            </button>
          </div>
        </div>
      )}

      {viewMode === 'day' ? (
        <div className="day-view">
          <div className="week-nav">
            <button onClick={goPrevDay} aria-label={t('calendar_day_prev')}>
              <PrevIcon size={18} strokeWidth={2} />
            </button>
            <a onClick={goToday}>{t('calendar_today_label')}</a>
            <button onClick={goNextDay} aria-label={t('calendar_day_next')}>
              <NextIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {(() => {
            const iso = toIsoDate(dayCursor);
            const isToday = iso === today;
            const dayEvents = events
              .filter((e) => e.date === iso)
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title));
            return (
              <div className={isToday ? 'week-day-card today' : 'week-day-card'}>
                <div className="week-day-head">
                  <span className="week-day-name">{t(WEEKDAY_KEYS[weekdayIndex(dayCursor)])}</span>
                  <span className="week-day-date nums">
                    {iso.slice(8, 10)}.{iso.slice(5, 7)}.{iso.slice(0, 4)}
                  </span>
                  {isToday && <span className="week-today-badge">{t('calendar_today_label')}</span>}
                  <button
                    className="week-day-add"
                    onClick={() => openFormForDate(iso)}
                    aria-label={t('calendar_week_add_event')}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
                {dayEvents.length === 0 ? (
                  <p className="week-day-empty">{t('calendar_no_events')}</p>
                ) : (
                  <div className="calendar-list">{dayEvents.map((e) => renderRow(e, false))}</div>
                )}
              </div>
            );
          })()}
        </div>
      ) : viewMode === 'list' ? (
        <>
          {upcoming.length === 0 ? (
            <div className="empty-state actionable" onClick={() => setShowForm(true)}>
              <div className="empty-state-icon">
                <CalendarX2 size={26} strokeWidth={2} />
              </div>
              <p>{t('calendar_no_events')}</p>
            </div>
          ) : (
            <div className="calendar-list">{upcoming.map((e) => renderRow(e))}</div>
          )}

          {expired.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('calendar_expired_title')}</h3>
              </div>
              <div className="calendar-list">{expired.map((e) => renderRow(e))}</div>
            </>
          )}
        </>
      ) : (
        <div className="week-view">
          <div className="week-nav">
            <button onClick={goPrevWeek} aria-label={t('calendar_week_prev')}>
              <PrevIcon size={18} strokeWidth={2} />
            </button>
            <a onClick={goCurrentWeek}>{t('calendar_today_label')}</a>
            <button onClick={goNextWeek} aria-label={t('calendar_week_next')}>
              <NextIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {weekDays.map((day, i) => {
            const iso = toIsoDate(day);
            const isToday = iso === today;
            const dayEvents = events
              .filter((e) => e.date === iso)
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title));
            return (
              <div className={isToday ? 'week-day-card today' : 'week-day-card'} key={iso}>
                <div className="week-day-head">
                  <span className="week-day-name">{t(WEEKDAY_KEYS[i])}</span>
                  <span className="week-day-date nums">{iso.slice(8, 10)}.{iso.slice(5, 7)}</span>
                  {isToday && <span className="week-today-badge">{t('calendar_today_label')}</span>}
                  <button
                    className="week-day-add"
                    onClick={() => openFormForDate(iso)}
                    aria-label={t('calendar_week_add_event')}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
                {dayEvents.length === 0 ? (
                  <p className="week-day-empty">{t('calendar_no_events')}</p>
                ) : (
                  <div className="calendar-list">{dayEvents.map((e) => renderRow(e, false))}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </TabLayout>
  );
}
