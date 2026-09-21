import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { isRtlLang } from '../context/translations';
import { getGuideArticles } from '../data/guideArticles';
import { GUIDE_ARTICLE_ICONS } from '../data/guideIcons';
import { isolateBidiRuns } from '../lib/bidiText';
import './GuideArticle.css';

/** Renders the `**…**` emphasis the article copy uses.
 *
 * The copy has carried these markers since the first non-school articles were
 * written, and nothing ever interpreted them — readers saw the asterisks. They
 * mark the one sentence in an article that costs money or time to miss ("the
 * deadline starts before the letter reaches you", "an AMS appointment is
 * compulsory"), so they are worth rendering rather than stripping.
 *
 * Splitting happens before isolateBidiRuns so each half still gets its Latin
 * runs isolated; running it the other way round would hand the bidi helper
 * markup it cannot walk into. */
function withEmphasis(text: string, rtl: boolean): ReactNode[] {
  return text.split('**').map((part, i) => {
    const content = rtl ? isolateBidiRuns(part) : part;
    return i % 2 === 1 ? <strong key={i}>{content}</strong> : <span key={i}>{content}</span>;
  });
}

export function GuideArticle() {
  const { id } = useParams<{ id: string }>();
  const { lang, gender } = useLanguage();
  const article = getGuideArticles(lang, gender).find((a) => a.id === id);

  if (!article) {
    return (
      <FlowLayout title="">
        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
          404
        </div>
      </FlowLayout>
    );
  }

  const Icon = GUIDE_ARTICLE_ICONS[article.id];

  return (
    <FlowLayout title={article.title}>
      <div className="card article-card">
        <div className="article-icon">
          <Icon size={32} strokeWidth={2} />
        </div>
        {article.paragraphs.map((p, i) => (
          <p className="article-paragraph" key={i}>
            {/* LTR-language paragraphs (German, Turkish...) are single-script —
                isolateBidiRuns is for short fragments embedded in RTL prose, and
                its regex doesn't even cover umlauts, so it would split words
                mid-word here. */}
            {withEmphasis(p, isRtlLang(lang))}
          </p>
        ))}
        {article.source && (
          /* The domain is the label. It says who is behind the claim without
             needing translating into six languages, and it is the part worth
             reading anyway — oesterreich.gv.at carries different weight from
             somebody's blog. Opens outside the app; rel is not optional on a
             target=_blank link. */
          <a className="article-source" href={article.source} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} strokeWidth={2.25} aria-hidden />
            <span dir="ltr">{new URL(article.source).hostname.replace(/^www\./, '')}</span>
          </a>
        )}
      </div>
    </FlowLayout>
  );
}
