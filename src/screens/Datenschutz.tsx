import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { privacyPolicyAr, privacyPolicyDe, privacyPolicyTr, privacyPolicyFa, privacyPolicyEn, privacyPolicyUk, PRIVACY_POLICY_LAST_UPDATED } from '../data/privacyPolicy';
import './Datenschutz.css';

const SECTIONS_BY_LANG = { ar: privacyPolicyAr, de: privacyPolicyDe, tr: privacyPolicyTr, fa: privacyPolicyFa, en: privacyPolicyEn, uk: privacyPolicyUk };

export function Datenschutz() {
  const { t, lang } = useLanguage();
  const sections = SECTIONS_BY_LANG[lang];

  return (
    <FlowLayout title={t('privacy_title')}>
      <div className="privacy-updated">
        {t('privacy_last_updated')} <span className="nums">{PRIVACY_POLICY_LAST_UPDATED}</span>
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
