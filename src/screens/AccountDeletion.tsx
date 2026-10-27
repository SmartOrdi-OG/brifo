import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import {
  accountDeletionAr,
  accountDeletionDe,
  accountDeletionTr,
  accountDeletionFa,
  accountDeletionEn,
  accountDeletionUk,
  ACCOUNT_DELETION_LAST_UPDATED,
} from '../data/accountDeletion';
import './Datenschutz.css';

const SECTIONS_BY_LANG = {
  ar: accountDeletionAr,
  de: accountDeletionDe,
  tr: accountDeletionTr,
  fa: accountDeletionFa,
  en: accountDeletionEn,
  uk: accountDeletionUk,
};

/** The page Google Play's listing points at for account deletion.
 *
 * Laid out like the Impressum and the privacy policy, and reachable without
 * signing in for the same reason they are — the person reading it may have
 * uninstalled the app already, which is exactly the case it exists for. */
export function AccountDeletion() {
  const { t, lang } = useLanguage();
  const sections = SECTIONS_BY_LANG[lang];

  return (
    <FlowLayout title={t('account_deletion_title')}>
      <div className="privacy-updated">
        {t('privacy_last_updated')} <span className="nums">{ACCOUNT_DELETION_LAST_UPDATED}</span>
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
