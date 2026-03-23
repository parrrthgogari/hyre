import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { rankCandidates, getSkillMatchDetails } from '../../utils/matching';

export default function CandidateRanking() {
  const { jobs, candidates, applications } = useData();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const job = jobs.find(j => j.id === selectedJobId);
  const ranked = job ? rankCandidates(candidates, job.skills || []) : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Candidate Ranking</h1>
        <p>All applicants scored and ranked by match percentage against your job requirements.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '8px' }}>Select Job Posting</label>
        <select className="input" value={selectedJobId} onChange={e => { setSelectedJobId(e.target.value); setSelectedCandidate(null); }}>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCandidate ? '1fr 1fr' : '1fr', gap: '24px' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Experience</th>
                <th>Match</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((c, i) => (
                <tr key={c.id} onClick={() => setSelectedCandidate(c)} style={{ cursor: 'pointer', background: selectedCandidate?.id === c.id ? 'var(--gray-50)' : 'transparent' }}>
                  <td>
                    <span style={{
                      width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                      background: i < 3 ? 'var(--black)' : 'var(--gray-200)',
                      color: i < 3 ? 'var(--white)' : 'var(--gray-600)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.75rem',
                    }}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar sm">{c.name?.[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{c.title}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--gray-500)' }}>{c.experience} yrs</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ width: '80px', height: '6px' }}>
                        <div className="progress-fill" style={{ width: `${c.matchScore}%` }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{c.matchScore}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedCandidate(c); }}>
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCandidate && job && (
          <div className="card animate-slide-in-left" style={{ position: 'sticky', top: '96px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="avatar lg">{selectedCandidate.name?.[0]}</div>
                <div>
                  <h3 style={{ marginBottom: '2px' }}>{selectedCandidate.name}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{selectedCandidate.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="btn btn-ghost btn-icon sm">✕</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span className="badge badge-black">{selectedCandidate.matchScore}% Match</span>
              <span className="badge badge-gray">{selectedCandidate.experience} yrs exp</span>
              <span className="badge badge-gray">{selectedCandidate.location}</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>Education</div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>{selectedCandidate.education}</div>
            </div>

            {(() => {
              const details = getSkillMatchDetails(selectedCandidate.skills || [], job.skills || []);
              return (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Skill Analysis</div>
                  {details.matched.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#065f46', marginBottom: '4px' }}>✓ Matched ({details.matched.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {details.matched.map((s, i) => <span key={i} className="badge badge-success" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                  {details.missing.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#991b1b', marginBottom: '4px' }}>✗ Missing ({details.missing.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {details.missing.map((s, i) => <span key={i} className="badge badge-danger" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                  {details.extra.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>+ Additional ({details.extra.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {details.extra.map((s, i) => <span key={i} className="badge badge-outline" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>Shortlist</button>
              <button className="btn btn-secondary" style={{ flex: 1 }}>Reject</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
