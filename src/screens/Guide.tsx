import { useNavigate } from 'react-router-dom';
import { TabLayout } from '../components/TabLayout';
import { Header } from '../components/Header';
import { useLanguage } from '../context/LanguageContext';
import { getGuideArticles } from '../data/guideArticles';
import { GUIDE_ARTICLE_ICONS } from '../data/guideIcons';
import { isolateBidiRuns } from '../lib/bidiText';
import './Guide.css';

export function Guide() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const articles = getGuideArticles(lang);

  return (
    <TabLayout>
      <Header />
      <div className="sec">
        <h3>{t('screen_guide')}</h3>
      </div>
      <div className="guide-list">
        {articles.map((article) => {
          const Icon = GUIDE_ARTICLE_ICONS[article.id];
          return (
            <div className="guide-card" key={article.id} onClick={() => navigate(`/guide/${article.id}`)}>
              <div className="guide-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="guide-text">
                <h4>{isolateBidiRuns(article.title)}</h4>
                <p>{isolateBidiRuns(article.teaser)}</p>
              </div>
              <span className="guide-arrow">›</span>
            </div>
          );
        })}
      </div>
    </TabLayout>
  );
}
