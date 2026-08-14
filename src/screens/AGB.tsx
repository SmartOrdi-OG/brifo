import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { agbAr, agbDe, agbTr, agbFa, AGB_LAST_UPDATED } from '../data/agb';
import './Datenschutz.css';

const SECTIONS_BY_LANG = { ar: agbAr, de: agbDe, tr: agbTr, fa: agbFa };

export function AGB() {
  const { t, lang } = useLanguage();
  const sections = SECTIONS_BY_LANG[lang];

  return (
    <FlowLayout title={t('agb_title')}>
      <div className="privacy-updated">
        {t('privacy_last_updated')} <span className="nums">{AGB_LAST_UPDATED}</span>
      </div>
      {sections.map((section) => (
        <div className="card privacy-section" key={section.heading}>
          <h3>{section.heading}</h3>
          {section.body.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ))}
    </FlowLayout>
  );
}
