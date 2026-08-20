import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isRtlLang } from '../context/translations';
import { getGuideArticles } from '../data/guideArticles';
import { isolateBidiRuns } from '../lib/bidiText';
import type { LetterAnalysis } from '../types/analysis';
import './GuideTip.css';

/** Picks the guide article worth reading for *this* letter.
 *
 * Deliberately driven by what the analysis already extracts rather than by a
 * new "what kind of letter is this" field: money owed and a deadline are the
 * two things that actually cost the reader something if misunderstood, and
 * both are already detected reliably. Adding a classification step would put
 * the existing, working extraction at risk for a slightly finer match.
 *
 * Money first: a bill carries a deadline too, and the payment article is the
 * more specific advice of the two. */
function articleIdFor(result: LetterAnalysis): string | null {
  if (result.payments.length > 0) return 'rechnung-mahnung';
  if (result.deadlines.length > 0) return 'behoerdenbrief';
  return null;
}

/** One contextual pointer into the guide, shown under a letter's result.
 *
 * At most one: the screen already carries a summary, actions, deadlines and
 * payments, and a stack of tips would compete with the letter itself. Renders
 * nothing when neither trigger applies — the Ratgeber tab still holds the
 * full set for anyone who goes looking. */
export function GuideTip({ result }: { result: LetterAnalysis }) {
  const id = articleIdFor(result);
  if (!id) return null;
  return <GuideTipCard articleId={id} />;
}

/** The card itself, for screens that already know which article is relevant
 * — the calendar and appointments, say, where no inference is needed. */
export function GuideTipCard({ articleId }: { articleId: string }) {
  const navigate = useNavigate();
  const { t, lang, gender } = useLanguage();

  const article = getGuideArticles(lang, gender).find((a) => a.id === articleId);
  if (!article) return null;

  const rtl = isRtlLang(lang);
  const bidi = (text: string) => (rtl ? isolateBidiRuns(text) : text);

  return (
    <button type="button" className="guide-tip" onClick={() => navigate(`/guide/${articleId}`)}>
      <span className="guide-tip-icon">
        <Lightbulb size={20} strokeWidth={2} />
      </span>
      <span className="guide-tip-text">
        <span className="guide-tip-label">{t('result_tip_label')}</span>
        <span className="guide-tip-title">{bidi(article.title)}</span>
        <span className="guide-tip-teaser">{bidi(article.teaser)}</span>
      </span>
      <span className="guide-tip-arrow" aria-hidden>
        ›
      </span>
    </button>
  );
}
