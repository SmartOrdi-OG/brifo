import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ThermometerSun,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Coins,
  Scale,
  HelpCircle,
  PenLine,
  Share2,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { isRtlLang } from '../context/translations';
import { isolateBidiRuns } from '../lib/bidiText';
import { classifyRequestError, isDefinitelyOffline, requestErrorKey } from '../lib/requestError';
import type { TranslationKey } from '../context/translations';
import type { ReplyIntent, ReplyLetter } from '../types/reply';
import type { ReplyPrefill } from '../lib/replyPrefill';
import './Reply.css';

type ScreenState = 'form' | 'generating' | 'result' | 'error';

const INTENTS: ReplyIntent[] = [
  'entschuldigung',
  'termin',
  'absage',
  'zustimmung',
  'ratenzahlung',
  'einspruch',
  'frage',
];
const INTENT_ICON: Record<ReplyIntent, LucideIcon> = {
  entschuldigung: ThermometerSun,
  termin: CalendarDays,
  absage: CalendarX2,
  zustimmung: CheckCircle2,
  ratenzahlung: Coins,
  einspruch: Scale,
  frage: HelpCircle,
};

export function Reply() {
  const { t, lang } = useLanguage();
  const location = useLocation();

  /** Arriving from a letter's or an appointment's ⋮ menu rather than from the
   * blank quick tool. The app already knows who wrote in, or who the
   * appointment is with, so those come pre-filled and the parent edits rather
   * than retypes. Read once as initial state: the fields stay editable. */
  const prefill = (location.state as { prefill?: ReplyPrefill } | null)?.prefill;

  const [state, setState] = useState<ScreenState>('form');
  const [intent, setIntent] = useState<ReplyIntent | null>(null);
  const [recipient, setRecipient] = useState(prefill?.recipient ?? '');
  const [childName, setChildName] = useState(prefill?.childName ?? '');
  const [childClass, setChildClass] = useState('');
  const [details, setDetails] = useState('');
  const [letter, setLetter] = useState<ReplyLetter | null>(null);
  const [copied, setCopied] = useState<'german' | 'arabic' | null>(null);
  const [errorKey, setErrorKey] = useState<TranslationKey>('reply_error');

  const canGenerate = intent !== null && details.trim().length >= 3;

  async function generate() {
    if (!canGenerate) return;
    if (isDefinitelyOffline()) {
      setErrorKey('error_offline');
      setState('error');
      return;
    }
    setState('generating');
    let status: number | undefined;
    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent,
          recipient: recipient.trim() || undefined,
          letterContext: prefill?.context || undefined,
          childName: childName.trim() || undefined,
          childClass: childClass.trim() || undefined,
          details: details.trim(),
          lang,
        }),
      });
      if (!response.ok) {
        status = response.status;
        throw new Error('request failed');
      }
      const result: ReplyLetter = await response.json();
      setLetter(result);
      setState('result');
    } catch {
      // A failed generation is retried from the same form, so 'unreadable'
      // gets the same wording as any other server-side failure — unlike the
      // scan, there is no photo to take differently.
      setErrorKey(requestErrorKey(classifyRequestError(status), 'reply_error', 'reply_error'));
      setState('error');
    }
  }

  function startOver() {
    setLetter(null);
    setState('form');
  }

  async function copy(text: string, which: 'german' | 'arabic') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard permission denied — nothing to recover, button stays as-is
    }
  }

  function shareWhatsApp(text: string) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  function shareEmail(text: string) {
    window.location.href = `mailto:?body=${encodeURIComponent(text)}`;
  }

  return (
    <FlowLayout title={t('screen_reply')}>
      {state === 'form' && (
        <div className="reply-form">
          <div className="sec">
            <h3>{t('reply_intent_title')}</h3>
          </div>
          <div className="intent-grid">
            {INTENTS.map((i) => {
              const Icon = INTENT_ICON[i];
              return (
                <button
                  key={i}
                  className={`intent-chip${intent === i ? ' selected' : ''}`}
                  onClick={() => setIntent(i)}
                >
                  <span className="intent-icon">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  {t(`reply_intent_${i}`)}
                </button>
              );
            })}
          </div>

          {prefill?.context && (
            <p className="reply-context">
              {t('reply_context_prefix')} {isolateBidiRuns(prefill.context)}
            </p>
          )}

          {/* First field, because it is what decides who the letter addresses.
              Without it the model fell back on the app's original case and
              wrote to the school no matter who the parent meant. */}
          <div className="field">
            <label>{t('reply_recipient_label')}</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={t('reply_recipient_placeholder')}
            />
          </div>
          <div className="field">
            <label>{t('reply_child_name')}</label>
            <input value={childName} onChange={(e) => setChildName(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('reply_child_class')}</label>
            <input value={childClass} onChange={(e) => setChildClass(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('reply_details_label')}</label>
            <textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t('reply_details_placeholder')}
            />
          </div>

          <button className="scan-btn primary reply-generate-btn" disabled={!canGenerate} onClick={generate}>
            <span className="btn-icon-label">
              <PenLine size={16} strokeWidth={2.5} /> {t('reply_generate')}
            </span>
          </button>
        </div>
      )}

      {state === 'generating' && (
        <div className="card analyzing-card">
          <div className="spinner" />
          <p>{t('reply_generating')}</p>
        </div>
      )}

      {state === 'error' && (
        <div className="card error-card">
          <p>{t(errorKey)}</p>
          <button className="scan-btn primary" onClick={startOver}>
            {t('scan_try_again')}
          </button>
        </div>
      )}

      {state === 'result' && letter && (
        <div className="reply-result">
          <div className="sec">
            <h3>{t('reply_german_label')}</h3>
          </div>
          <div className="card letter-card" dir="ltr">
            {/* Always German, never mixed with Arabic — isolateBidiRuns is for short
                Latin fragments embedded in Arabic prose, and its regex doesn't even
                cover umlauts, so it would split German words mid-word here. */}
            <p className="letter-text">{letter.german}</p>
            <div className="letter-actions">
              <button className="scan-btn" onClick={() => copy(letter.german, 'german')}>
                {copied === 'german' ? t('reply_copied') : t('reply_copy')}
              </button>
              <button className="scan-btn" onClick={() => shareEmail(letter.german)}>
                <span className="btn-icon-label">
                  <Mail size={16} strokeWidth={2.5} /> {t('reply_share_email')}
                </span>
              </button>
              <button className="scan-btn primary" onClick={() => shareWhatsApp(letter.german)}>
                <span className="btn-icon-label">
                  <Share2 size={16} strokeWidth={2.5} /> {t('reply_share_whatsapp')}
                </span>
              </button>
            </div>
          </div>

          <div className="sec">
            <h3>{t('reply_translation_label')}</h3>
          </div>
          <div className="card letter-card" dir={isRtlLang(lang) ? 'rtl' : 'ltr'}>
            {/* isolateBidiRuns protects short Latin fragments inside RTL prose;
                on LTR translations it would split words mid-word instead. */}
            <p className="letter-text">{isRtlLang(lang) ? isolateBidiRuns(letter.translation) : letter.translation}</p>
            <div className="letter-actions">
              <button className="scan-btn" onClick={() => copy(letter.translation, 'arabic')}>
                {copied === 'arabic' ? t('reply_copied') : t('reply_copy')}
              </button>
            </div>
          </div>

          <button className="scan-btn reply-generate-btn" onClick={startOver}>
            {t('reply_new')}
          </button>
        </div>
      )}
    </FlowLayout>
  );
}
