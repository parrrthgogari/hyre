import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { analyzeSkillGap, hasApiKey } from '../../utils/gemini';

export default function SkillGap() {
  const { resume } = useData();
  const [targetRole, setTargetRole] = useState('Senior Frontend Developer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const mySkills = resume?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'Git'];

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      if (hasApiKey()) {
        const result = await analyzeSkillGap(mySkills, targetRole);
        if (result) { setAnalysis(result); setLoading(false); return; }
      }
      // Fallback demo data
      setAnalysis({
        matchedSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git'],
        missingSkills: ['GraphQL', 'Testing', 'CI/CD', 'Performance Optimization'],
        partialSkills: [
          { skill: 'TypeScript', level: 'intermediate', needed: 'advanced' },
          { skill: 'AWS', level: 'beginner', needed: 'intermediate' },
        ],
        recommendations: [
          { skill: 'GraphQL', priority: 'high', courses: [{ name: 'GraphQL Mastery', platform: 'Udemy', url: '#', duration: '12 hours' }, { name: 'Apollo Client & Server', platform: 'Frontend Masters', url: '#', duration: '8 hours' }] },
          { skill: 'Testing', priority: 'high', courses: [{ name: 'React Testing Library', platform: 'Testing JavaScript', url: '#', duration: '6 hours' }] },
          { skill: 'CI/CD', priority: 'medium', courses: [{ name: 'GitHub Actions CI/CD', platform: 'YouTube', url: '#', duration: '4 hours' }] },
          { skill: 'Performance', priority: 'medium', courses: [{ name: 'Web Performance', platform: 'web.dev', url: '#', duration: '10 hours' }] },
        ],
        overallReadiness: 68,
        summary: 'You have strong fundamentals in React and JavaScript. Focus on GraphQL, testing practices, and CI/CD to become a competitive Senior Frontend Developer candidate.',
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const roles = ['Senior Frontend Developer', 'Full Stack Engineer', 'Backend Developer', 'ML Engineer', 'DevOps Engineer', 'Data Analyst', 'Mobile Developer'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Skill Gap Analysis</h1>
        <p>Discover what skills you need to land your target role.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px' }}>Target Role</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {roles.map(r => (
            <button key={r} className={`btn btn-sm ${targetRole === r ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTargetRole(r)}>
              {r}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Analyzing...</> : 'Analyze Gap →'}
        </button>
      </div>

      {analysis && (
        <div className="animate-fade-in">
          {/* Readiness Score */}
          <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '8px' }}>Overall Readiness for {targetRole}</div>
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 16px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--gray-200)" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--black)" strokeWidth="10"
                  strokeDasharray={`${analysis.overallReadiness * 4.4} 440`}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{analysis.overallReadiness}%</span>
              </div>
            </div>
            <p style={{ color: 'var(--gray-600)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>{analysis.summary}</p>
          </div>

          {/* Skill Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="card">
              <h4 style={{ marginBottom: '12px', color: '#065f46' }}>✓ Matched Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analysis.matchedSkills.map((s, i) => <span key={i} className="badge badge-success">{s}</span>)}
              </div>
            </div>
            <div className="card">
              <h4 style={{ marginBottom: '12px', color: '#991b1b' }}>✗ Missing Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analysis.missingSkills.map((s, i) => <span key={i} className="badge badge-danger">{s}</span>)}
              </div>
            </div>
            <div className="card">
              <h4 style={{ marginBottom: '12px', color: '#92400e' }}>↗ Needs Improvement</h4>
              {analysis.partialSkills.map((s, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{s.level} → {s.needed}</div>
                  <div className="progress-bar" style={{ marginTop: '4px', height: '4px' }}>
                    <div className="progress-fill" style={{ width: s.level === 'beginner' ? '30%' : '60%', background: '#92400e' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Recommendations */}
          <div className="card">
            <h4 style={{ marginBottom: '20px' }}>📚 Recommended Courses</h4>
            {analysis.recommendations.map((rec, i) => (
              <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < analysis.recommendations.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1rem' }}>{rec.skill}</h4>
                  <span className={`badge ${rec.priority === 'high' ? 'badge-danger' : rec.priority === 'medium' ? 'badge-warning' : 'badge-gray'}`}>
                    {rec.priority} priority
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rec.courses.map((c, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{c.platform} • {c.duration}</div>
                      </div>
                      <a href={c.url} className="btn btn-ghost btn-sm" target="_blank">View →</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
