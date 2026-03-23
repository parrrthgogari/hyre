import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { statusColors } from '../../utils/mockData';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { jobs, applications, candidates } = useData();

  const myJobs = jobs.filter(j => j.status === 'active');
  const totalApplicants = applications.length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const offeredCount = applications.filter(a => a.status === 'offered').length;

  const statCards = [
    { label: 'Active Postings', value: myJobs.length, icon: '◧', change: '+2 this month' },
    { label: 'Total Applicants', value: totalApplicants, icon: '⊞', change: '+12 this week' },
    { label: 'In Interview', value: interviewCount, icon: '◈', change: 'Ongoing' },
    { label: 'Offers Made', value: offeredCount, icon: '✦', change: 'This quarter' },
  ];

  const recentApps = applications.slice(-5).reverse();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0] || 'Recruiter'}</h1>
        <p>Your recruitment overview</p>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Active Postings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4>Active Job Postings</h4>
            <Link to="/recruiter/jd-builder" className="btn btn-ghost btn-sm">Create New →</Link>
          </div>
          {myJobs.slice(0, 4).map((job, i) => {
            const appCount = applications.filter(a => a.jobId === job.id).length;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{job.title}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{job.company}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{appCount}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>applicants</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h4 style={{ marginBottom: '20px' }}>Recent Applications</h4>
          {recentApps.map((app, i) => {
            const candidate = candidates.find(c => c.id === app.candidateId);
            const job = jobs.find(j => j.id === app.jobId);
            const sc = statusColors[app.status];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < recentApps.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <div className="avatar sm">{candidate?.name?.[0] || '?'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{candidate?.name || 'Unknown'}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{job?.title}</div>
                </div>
                <span className="badge" style={{ background: sc?.bg, color: sc?.text }}>{sc?.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
        {[
          { to: '/recruiter/jd-builder', label: 'Create Job Description', icon: '◉', desc: 'AI-guided JD builder' },
          { to: '/recruiter/candidates', label: 'View Candidates', icon: '⊞', desc: 'Ranked by match' },
          { to: '/recruiter/pipeline', label: 'Pipeline Board', icon: '◧', desc: 'Kanban management' },
        ].map((action, i) => (
          <Link key={i} to={action.to} className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{action.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{action.label}</div>
            <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
