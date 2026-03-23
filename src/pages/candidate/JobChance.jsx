import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cosineSimilarity, calculatePercentile } from '../../utils/matching';

export default function JobChance() {
  const { user } = useAuth();
  const { jobs, applications, candidates, resume } = useData();

  const mySkills = resume?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'Git'];
  const myApps = applications.filter(a => a.candidateId === user?.id || a.candidateId === 'cand-1');

  const jobChances = myApps.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    if (!job) return null;

    const myScore = cosineSimilarity(mySkills, job.skills || []);
    
    const otherScores = candidates
      .filter(c => c.id !== (user?.id || 'cand-1'))
      .map(c => cosineSimilarity(c.skills || [], job.skills || []));
    
    const allScores = [...otherScores, myScore];
    const percentile = calculatePercentile(myScore, allScores);

    return { ...app, job, myScore, percentile, totalApplicants: allScores.length };
  }).filter(Boolean);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Job Chance</h1>
        <p>Your percentile ranking against other applicants for each position.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {jobChances.map((item, i) => (
          <div key={i} className="card" style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h4 style={{ marginBottom: '4px' }}>{item.job.title}</h4>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{item.job.company}</p>
              </div>
              <span className={`badge ${item.percentile >= 70 ? 'badge-success' : item.percentile >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                Top {100 - item.percentile}%
              </span>
            </div>

            {/* Gauge */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--black)" strokeWidth="8"
                    strokeDasharray={`${item.percentile * 3.14} 314`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{item.percentile}%</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--gray-500)' }}>Percentile</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.myScore}%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--gray-500)' }}>Match Score</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.totalApplicants}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--gray-500)' }}>Applicants</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{item.job.salary?.split('-')[0] || '—'}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--gray-500)' }}>Min Salary</div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '6px' }}>
                <span>Your position</span>
                <span>{item.percentile}th percentile</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.percentile}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobChances.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>◎</div>
          <h3>No Applications Yet</h3>
          <p style={{ color: 'var(--gray-500)', marginTop: '8px' }}>Apply to jobs to see your chance of getting them.</p>
        </div>
      )}
    </div>
  );
}
