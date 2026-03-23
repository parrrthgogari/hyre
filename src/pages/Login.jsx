import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!form.name || !form.email || !form.password) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        const result = register({ ...form, role });
        if (result.success) {
          navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
        } else {
          setError(result.error);
        }
      } else {
        if (!form.email || !form.password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        const result = login(form.email, form.password);
        if (result.success) {
          const users = JSON.parse(localStorage.getItem('djob_users') || '[]');
          const u = users.find(u => u.email === form.email);
          navigate(u?.role === 'recruiter' ? '/recruiter' : '/candidate');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--black)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'var(--white)' }}>
          <Link to="/" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
            <span style={{ width: '40px', height: '40px', background: 'var(--white)', color: 'var(--black)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 900 }}>D</span>
            DJob
          </Link>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
            {isRegister ? 'Join the Future' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '360px' }}>
            {isRegister
              ? 'Create your account and start connecting with opportunities.'
              : 'Sign in to access your personalized dashboard.'}
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--white)',
        borderRadius: '32px 0 0 32px',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: '32px', fontSize: '0.9375rem' }}>
            {isRegister ? 'Fill in your details to get started' : 'Enter your credentials'}
          </p>

          {isRegister && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {['candidate', 'recruiter'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === r ? 'var(--black)' : 'var(--gray-200)'}`,
                    background: role === r ? 'var(--black)' : 'var(--white)',
                    color: role === r ? 'var(--white)' : 'var(--gray-600)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textTransform: 'capitalize',
                  }}
                >
                  {r === 'candidate' ? '👤 Candidate' : '🏢 Recruiter'}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>

            {isRegister && role === 'recruiter' && (
              <div className="input-group">
                <label>Company Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Your Company"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                />
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: '#fef2f2',
                color: '#991b1b',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              ) : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '0.9375rem',
            color: 'var(--gray-500)',
          }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none',
                color: 'var(--black)',
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9375rem',
              }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
