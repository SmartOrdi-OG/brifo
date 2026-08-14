import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { impressumAr, impressumDe, impressumTr, impressumFa, impressumEn, IMPRESSUM_LAST_UPDATED } from '../data/impressum';
import './Datenschutz.css';

const SECTIONS_BY_LANG = { ar: impressumAr, de: impressumDe, tr: impressumTr, fa: impressumFa, en: impressumEn };

export function Impressum() {
  const { t, lang } = useLanguage();
  const sections = SECTIONS_BY_LANG[lang];

  return (
    <FlowLayout title={t('impressum_title')}>
      <div className="privacy-updated">
        {t('privacy_last_updated')} <span className="nums">{IMPRESSUM_LAST_UPDATED}</span>
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
