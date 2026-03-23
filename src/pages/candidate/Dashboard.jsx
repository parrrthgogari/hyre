import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { matchJobsToCandidate } from '../../utils/matching';
import { statusColors } from '../../utils/mockData';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { jobs, applications, resume, interviewResults } = useData();

  const mySkills = resume?.skills || ['React', 'JavaScript', 'CSS', 'Git'];
  const myApps = applications.filter(a => a.candidateId === user?.id || a.candidateId === 'cand-1');
  const topMatches = matchJobsToCandidate(jobs, mySkills).slice(0, 3);
  const recentInterviews = interviewResults.slice(0, 3);

  const statCards = [
    { label: 'Applications', value: myApps.length, icon: '◧', change: '+3 this week' },
    { label: 'Interviews', value: myApps.filter(a => a.status === 'interview').length, icon: '◈', change: 'Upcoming' },
    { label: 'Shortlisted', value: myApps.filter(a => a.status === 'shortlisted').length, icon: '✦', change: 'Active' },
    { label: 'Best Match', value: topMatches[0] ? `${topMatches[0].matchScore}%` : '—', icon: '◎', change: topMatches[0]?.title || '' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}</h1>
        <p>Here's your career snapshot</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4 stagger-children" style={{ marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">{s.label}</span>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <span className="stat-value">{s.value}</span>
            <span className="stat-change positive">{s.change}</span>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Job Matches */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4>Top Job Matches</h4>
            <Link to="/candidate/jobs" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topMatches.map((job, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gray-50)',
                transition: 'all var(--transition-fast)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{job.title}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{job.company}</div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--black)',
                  color: 'var(--white)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                }}>
                  {job.matchScore}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4>Recent Applications</h4>
            <Link to="/candidate/applications" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myApps.slice(0, 4).map((app, i) => {
              const job = jobs.find(j => j.id === app.jobId);
              const sc = statusColors[app.status];
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gray-50)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{job?.title || 'Job'}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{app.appliedDate}</div>
                  </div>
                  <span className="badge" style={{ background: sc?.bg, color: sc?.text }}>
                    {sc?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
        {[
          { to: '/candidate/resume', label: 'Upload Resume', icon: '◉', desc: 'Parse and analyze your CV' },
          { to: '/candidate/interview', label: 'Mock Interview', icon: '◈', desc: 'Practice with AI' },
          { to: '/candidate/gap', label: 'Skill Gap Analysis', icon: '△', desc: 'Find areas to improve' },
        ].map((action, i) => (
          <Link key={i} to={action.to} className="card" style={{ textDecoration: 'none', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{action.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{action.label}</div>
            <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
