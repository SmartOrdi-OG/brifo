import { Construction } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function ComingSoon() {
  const { t } = useLanguage();
  return (
    <div className="card" style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)' }}>
      <Construction size={28} strokeWidth={2} style={{ marginBottom: 8 }} />
      <div>{t('coming_soon')}</div>
    </div>
  );
}
