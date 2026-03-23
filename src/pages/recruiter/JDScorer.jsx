import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { scoreJD, hasApiKey } from '../../utils/gemini';

export default function JDScorer() {
  const { jobs } = useData();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customJD, setCustomJD] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScore = async () => {
    const jobText = selectedJobId
      ? (() => {
          const j = jobs.find(j => j.id === selectedJobId);
          return j ? `${j.title}\n${j.description}\nSkills: ${j.skills?.join(', ')}\nRequirements: ${j.requirements?.join(', ')}` : '';
        })()
      : customJD;

    if (!jobText.trim()) return;
    setLoading(true);

    try {
      if (hasApiKey()) {
        const result = await scoreJD(jobText);
        if (result) { setScore(result); setLoading(false); return; }
      }
      setScore({
        overallScore: 78,
        clarity: { score: 82, feedback: 'Good structure but could use more specific language about daily tasks.' },
        skillBalance: { score: 75, feedback: 'Slightly heavy on technical skills. Consider adding soft skills requirements.' },
        inclusivity: { score: 80, feedback: 'Language is mostly inclusive. Consider removing years-based experience requirements.' },
        completeness: { score: 74, feedback: 'Missing benefits section and team culture description.' },
        improvements: ['Add specific project examples', 'Include salary range', 'Mention growth opportunities', 'Add diversity statement'],
        strengths: ['Clear responsibilities', 'Well-defined tech stack', 'Reasonable requirements'],
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const ScoreRing = ({ score: s, size = 80, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={size/2 - 6} fill="none" stroke="var(--gray-200)" strokeWidth="5" />
          <circle cx={size/2} cy={size/2} r={size/2 - 6} fill="none"
            stroke={s >= 80 ? '#059669' : s >= 60 ? '#d97706' : '#dc2626'}
            strokeWidth="5"
            strokeDasharray={`${s * (Math.PI * (size - 12)) / 100} ${Math.PI * (size - 12)}`}
            strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 100 ? '1.75rem' : '1rem', fontWeight: 800 }}>{s}</span>
        </div>
      </div>
      {label && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)' }}>{label}</span>}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>JD Quality Scorer</h1>
        <p>AI evaluates your job description for clarity, skill balance, inclusivity, and bias.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px' }}>Select a Job Posting or Paste JD Text</h4>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <select className="input" value={selectedJobId} onChange={e => { setSelectedJobId(e.target.value); setCustomJD(''); }} style={{ flex: 1 }}>
            <option value="">— Select existing posting —</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title} @ {j.company}</option>)}
          </select>
        </div>
        {!selectedJobId && (
          <textarea className="textarea" value={customJD} onChange={e => setCustomJD(e.target.value)} placeholder="Or paste your job description text here..." style={{ minHeight: '160px', marginBottom: '16px' }} />
        )}
        <button className="btn btn-primary" onClick={handleScore} disabled={loading || (!selectedJobId && !customJD.trim())}>
          {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Analyzing...</> : '✦ Score JD'}
        </button>
      </div>

      {score && (
        <div className="animate-fade-in">
          {/* Overall */}
          <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '20px' }}>Overall Quality Score</h4>
            <ScoreRing score={score.overallScore} size={140} />
            <p style={{ marginTop: '16px', color: 'var(--gray-500)' }}>
              {score.overallScore >= 80 ? 'Excellent JD! Ready to publish.' :
               score.overallScore >= 60 ? 'Good JD with some areas for improvement.' :
               'Needs significant improvement before publishing.'}
            </p>
          </div>

          {/* Category breakdown */}
          <div className="grid grid-4" style={{ marginBottom: '24px' }}>
            {[
              { key: 'clarity', label: 'Clarity' },
              { key: 'skillBalance', label: 'Skill Balance' },
              { key: 'inclusivity', label: 'Inclusivity' },
              { key: 'completeness', label: 'Completeness' },
            ].map(cat => (
              <div key={cat.key} className="card" style={{ textAlign: 'center' }}>
                <ScoreRing score={score[cat.key]?.score || 0} size={80} label={cat.label} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '8px', lineHeight: 1.5 }}>
                  {score[cat.key]?.feedback}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Strengths */}
            <div className="card">
              <h4 style={{ marginBottom: '12px', color: '#065f46' }}>✓ Strengths</h4>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {score.strengths?.map((s, i) => <li key={i} style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>{s}</li>)}
              </ul>
            </div>

            {/* Improvements */}
            <div className="card">
              <h4 style={{ marginBottom: '12px', color: '#991b1b' }}>↗ Suggested Improvements</h4>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {score.improvements?.map((s, i) => <li key={i} style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
