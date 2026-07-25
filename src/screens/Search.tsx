import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { isolateBidiRuns } from '../lib/bidiText';
import './Search.css';

function matches(query: string, ...fields: (string | null | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export function Search() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { children, letters, payments } = useData();
  const [query, setQuery] = useState('');

  const q = query.trim();
  const childName = (childId: string) => children.find((c) => c.id === childId)?.name;

  const matchedLetters = q
    ? letters.filter((l) =>
        matches(
          q,
          l.analysis.summary,
          l.analysis.detected_child_name,
          ...l.analysis.actions,
          ...l.analysis.deadlines.map((d) => d.what),
        ),
      )
    : [];

  const matchedPayments = q ? payments.filter((p) => matches(q, p.reason)) : [];

  const hasResults = matchedLetters.length > 0 || matchedPayments.length > 0;

  return (
    <FlowLayout title={t('screen_search')}>
      <div className="search-box">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder')}
        />
      </div>

      {!q ? null : !hasResults ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <SearchX size={26} strokeWidth={2} />
          </div>
          <p>{t('search_no_results')}</p>
        </div>
      ) : (
        <>
          {matchedLetters.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('search_section_letters')}</h3>
              </div>
              <div className="search-list">
                {matchedLetters.map((l) => (
                  <div
                    className="card search-row"
                    key={l.id}
                    onClick={() => navigate('/result', { state: { result: l.analysis, photo: l.photo } })}
                  >
                    <h4>{isolateBidiRuns(l.analysis.summary)}</h4>
                    <p>
                      {isolateBidiRuns(childName(l.childId) ?? t('assign_all_children'))}
                      {' · '}
                      <span className="nums">{l.createdAt.slice(0, 10)}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {matchedPayments.length > 0 && (
            <>
              <div className="sec">
                <h3>{t('search_section_payments')}</h3>
              </div>
              <div className="search-list">
                {matchedPayments.map((p) => (
                  <div className="card search-row" key={p.id} onClick={() => navigate('/calendar')}>
                    <h4>{isolateBidiRuns(p.reason)}</h4>
                    <p>
                      {isolateBidiRuns(childName(p.childId) ?? t('assign_all_children'))}
                      {' · '}
                      <span className="nums">
                        {p.amount} {p.currency}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </FlowLayout>
  );
}
