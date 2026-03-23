import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const candidateLinks = [
  { to: '/candidate', label: 'Dashboard', icon: '◫' },
  { to: '/candidate/resume', label: 'Resume', icon: '◉' },
  { to: '/candidate/skills', label: 'Skill Map', icon: '✦' },
  { to: '/candidate/jobs', label: 'Job Matching', icon: '⊞' },
  { to: '/candidate/gap', label: 'Skill Gap', icon: '△' },
  { to: '/candidate/applications', label: 'Applications', icon: '◧' },
  { to: '/candidate/chance', label: 'Job Chance', icon: '◎' },
  { to: '/candidate/interview', label: 'Mock Interview', icon: '◈' },
];

const recruiterLinks = [
  { to: '/recruiter', label: 'Dashboard', icon: '◫' },
  { to: '/recruiter/jd-builder', label: 'JD Builder', icon: '◉' },
  { to: '/recruiter/jd-scorer', label: 'JD Scorer', icon: '✦' },
  { to: '/recruiter/candidates', label: 'Candidates', icon: '⊞' },
  { to: '/recruiter/benchmark', label: 'Benchmark', icon: '△' },
  { to: '/recruiter/pipeline', label: 'Pipeline', icon: '◧' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  const isLanding = location.pathname === '/' || location.pathname === '/login';
  if (isLanding) return null;

  const links = user.role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: '64px',
      bottom: 0,
      width: '260px',
      background: 'var(--white)',
      borderRight: '1px solid var(--gray-200)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      overflowY: 'auto',
      zIndex: 50,
    }}>
      <div style={{
        padding: '12px 16px',
        marginBottom: '8px',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {user.role === 'recruiter' ? 'Recruiter Panel' : 'Candidate Panel'}
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: '700', marginTop: '4px', color: 'var(--gray-900)' }}>
          {user.name}
        </div>
      </div>

      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/candidate' || link.to === '/recruiter'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9375rem',
            fontWeight: isActive ? '600' : '500',
            color: isActive ? 'var(--black)' : 'var(--gray-500)',
            background: isActive ? 'var(--gray-100)' : 'transparent',
            transition: 'all var(--transition-fast)',
            textDecoration: 'none',
          })}
        >
          <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--gray-200)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'center' }}>
          DJob © 2026
        </div>
      </div>
    </aside>
  );
}
