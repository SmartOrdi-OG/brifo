import { Share, SquarePlus, LayoutGrid, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './AddToHomeScreenHint.css';

/** What the settings screen shows an iPhone instead of "not supported".
 *
 * The steps carry the two icons the user is hunting for in Safari's own
 * chrome — the share square and the plus — because the names of those buttons
 * are in German or English on most phones here, and the shape is the part
 * that survives not reading the system language. See lib/notificationBlock.
 */
export function AddToHomeScreenHint() {
  const { t } = useLanguage();

  return (
    <div className="a2hs" role="note">
      <p className="a2hs-title">
        <Bell size={15} strokeWidth={2.5} />
        {t('reminders_ios_title')}
      </p>
      <p className="a2hs-intro">{t('reminders_ios_intro')}</p>
      <ol className="a2hs-steps">
        <li>
          <span className="a2hs-step-icon">
            <Share size={16} strokeWidth={2} />
          </span>
          {t('reminders_ios_step_share')}
        </li>
        <li>
          <span className="a2hs-step-icon">
            <SquarePlus size={16} strokeWidth={2} />
          </span>
          {t('reminders_ios_step_add')}
        </li>
        <li>
          <span className="a2hs-step-icon">
            <LayoutGrid size={16} strokeWidth={2} />
          </span>
          {t('reminders_ios_step_open')}
        </li>
      </ol>
    </div>
  );
}
