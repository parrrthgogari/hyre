import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: isLanding ? 'transparent' : 'rgba(255,255,255,0.9)',
      backdropFilter: isLanding ? 'none' : 'blur(20px)',
      borderBottom: isLanding ? 'none' : '1px solid var(--gray-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 100,
      transition: 'all var(--transition-base)',
    }}>
      <Link to="/" style={{
        fontSize: '1.5rem',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        color: isLanding ? 'var(--white)' : 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          width: '32px',
          height: '32px',
          background: isLanding ? 'var(--white)' : 'var(--black)',
          color: isLanding ? 'var(--black)' : 'var(--white)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 900,
        }}>D</span>
        DJob
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!user ? (
          <>
            <Link to="/login" className="btn btn-ghost" style={{
              color: isLanding ? 'var(--white)' : 'var(--gray-700)',
            }}>Sign In</Link>
            <Link to="/login?mode=register" className="btn btn-primary" style={{
              background: isLanding ? 'var(--white)' : 'var(--black)',
              color: isLanding ? 'var(--black)' : 'var(--white)',
            }}>Get Started</Link>
          </>
        ) : (
          <>
            <Link to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} className="btn btn-ghost" style={{
              color: isLanding ? 'var(--white)' : 'var(--gray-700)',
            }}>Dashboard</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="avatar sm">{user.name?.[0] || 'U'}</div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{
                color: isLanding ? 'var(--white)' : 'var(--gray-700)',
              }}>Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
