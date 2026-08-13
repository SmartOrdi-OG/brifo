import { useParams } from 'react-router-dom';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { getGuideArticles } from '../data/guideArticles';
import { GUIDE_ARTICLE_ICONS } from '../data/guideIcons';
import { isolateBidiRuns } from '../lib/bidiText';
import './GuideArticle.css';

export function GuideArticle() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const article = getGuideArticles(lang).find((a) => a.id === id);

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
            {isolateBidiRuns(p)}
          </p>
        ))}
      </div>
    </FlowLayout>
  );
}
