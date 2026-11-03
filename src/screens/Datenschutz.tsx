import { useState } from 'react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { privacyPolicyAr, privacyPolicyDe, privacyPolicyTr, privacyPolicyFa, privacyPolicyEn, privacyPolicyUk, PRIVACY_POLICY_LAST_UPDATED } from '../data/privacyPolicy';
import './Datenschutz.css';

const SECTIONS_BY_LANG = { ar: privacyPolicyAr, de: privacyPolicyDe, tr: privacyPolicyTr, fa: privacyPolicyFa, en: privacyPolicyEn, uk: privacyPolicyUk };

export function Datenschutz() {
  const { t, lang } = useLanguage();
  // The German text is the complete, authoritative version; until the other
  // five are fully translated, every reader can switch to it in one tap. The
  // label stays German on purpose — it names what the button opens.
  const [showGerman, setShowGerman] = useState(false);
  const german = showGerman || lang === 'de';
  const sections = german ? privacyPolicyDe : SECTIONS_BY_LANG[lang];

  return (
    <FlowLayout title={t('privacy_title')}>
      <div className="privacy-updated">
        {t('privacy_last_updated')} <span className="nums">{PRIVACY_POLICY_LAST_UPDATED}</span>
      </div>
      {lang !== 'de' && (
        <button
          className="scan-btn"
          onClick={() => setShowGerman(!showGerman)}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {showGerman ? t('privacy_title') : 'Deutsche Fassung (maßgeblich)'}
        </button>
      )}
      <div dir={german ? 'ltr' : undefined}>
        {sections.map((section) => (
          <div className="card privacy-section" key={section.heading}>
            <h3>{section.heading}</h3>
            {section.body.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ))}
      </div>
    </FlowLayout>
  );
}
