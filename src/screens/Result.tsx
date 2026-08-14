import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { AddToCalendarButton } from '../components/AddToCalendarButton';
import { useLanguage } from '../context/LanguageContext';
import { isolateBidiRuns } from '../lib/bidiText';
import type { LetterAnalysis } from '../types/analysis';
import type { LetterPhoto } from '../types/data';
import './Result.css';

export function Result() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const location = useLocation();
  const [showPhoto, setShowPhoto] = useState(false);
  const state = location.state as { result?: LetterAnalysis; photo?: LetterPhoto | null } | null;
  const result = state?.result;
  const photo = state?.photo;

  return (
    <FlowLayout title={t('screen_result')}>
      {!result ? (
        <div className="card result-empty">
          <p>{t('result_no_data')}</p>
          <button className="scan-btn primary" onClick={() => navigate('/scan')}>
            {t('result_scan_another')}
          </button>
        </div>
      ) : (
        <div className="result-view">
          <div className={`card summary-card urgency-${result.urgency}`}>
            <span className="urgency-badge">{t(`urgency_${result.urgency}`)}</span>
            <p className="summary-text">{isolateBidiRuns(result.summary)}</p>
            <p className="action-flag">
              <span className="btn-icon-label">
                {result.action_required ? (
                  <AlertTriangle size={15} strokeWidth={2.25} />
                ) : (
                  <CheckCircle2 size={15} strokeWidth={2.25} />
                )}
                {result.action_required ? t('result_action_required') : t('result_no_action')}
              </span>
            </p>
          </div>

          {photo && (
            <div className="card original-photo-card">
              <button className="original-photo-toggle" onClick={() => setShowPhoto((v) => !v)}>
                <span className="btn-icon-label">
                  {showPhoto ? <EyeOff size={16} strokeWidth={2.25} /> : <Eye size={16} strokeWidth={2.25} />}
                  {showPhoto ? t('result_hide_original') : t('result_show_original')}
                </span>
              </button>
              {showPhoto && <img src={`data:${photo.mediaType};base64,${photo.base64}`} alt="" className="original-photo-img" />}
            </div>
          )}

          {result.actions.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('result_actions_title')}</h3>
              </div>
              <div className="card actions-card">
                {result.actions.map((action, i) => (
                  <label className="action-item" key={i}>
                    <input type="checkbox" />
                    <span>{isolateBidiRuns(action)}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {result.deadlines.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('result_deadlines_title')}</h3>
              </div>
              <div className="deadlines">
                {result.deadlines.map((d, i) => (
                  <div className="dl soon" key={i}>
                    <span className="when nums">{d.date}</span>
                    <h4>{isolateBidiRuns(d.what)}</h4>
                    <AddToCalendarButton title={d.what} date={d.date} />
                  </div>
                ))}
              </div>
            </>
          )}

          {result.payments.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('child_profile_payments')}</h3>
              </div>
              <div className="deadlines">
                {result.payments.map((p, i) => (
                  <div className="dl soon" key={i}>
                    <span className="when nums">{p.due_date}</span>
                    <h4>{isolateBidiRuns(p.reason)}</h4>
                    <p className="nums">
                      {p.amount} {p.currency}
                    </p>
                    <AddToCalendarButton title={p.reason} date={p.due_date} />
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="scan-btn primary result-cta" onClick={() => navigate('/scan')}>
            {t('result_scan_another')}
          </button>
        </div>
      )}
    </FlowLayout>
  );
}
