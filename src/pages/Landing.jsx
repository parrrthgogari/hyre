import { Link } from 'react-router-dom';

const features = [
  { icon: '◉', title: 'AI Resume Parsing', desc: 'Upload your resume and let AI extract skills, experience, and match you with perfect opportunities.' },
  { icon: '✦', title: 'Intelligent Matching', desc: 'Cosine similarity scoring matches your profile against every job posting automatically.' },
  { icon: '◈', title: 'AI Mock Interviews', desc: 'Practice with AI-generated role-specific questions and get instant, detailed feedback.' },
  { icon: '⊞', title: 'Smart JD Builder', desc: 'Recruiters create rich job descriptions through guided AI-powered workflows.' },
  { icon: '◎', title: 'Candidate Ranking', desc: 'Automatically score and rank every applicant against your job requirements.' },
  { icon: '◧', title: 'Pipeline Management', desc: 'Drag-and-drop Kanban boards to manage candidates through your hiring pipeline.' },
];

const stats = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '50K+', label: 'Candidates' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '3x', label: 'Faster Hiring' },
];

export default function Landing() {
  return (
    <div style={{ background: 'var(--black)', color: 'var(--white)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        {/* Gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite 2s',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '0.875rem',
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease-out',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            AI-Powered Job Matching is Live
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease-out 0.1s both',
          }}>
            Where Talent Meets<br />
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Opportunity</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '560px',
            margin: '0 auto 48px',
            lineHeight: 1.6,
            animation: 'fadeInUp 0.6s ease-out 0.2s both',
          }}>
            An intelligent job ecosystem that transforms hiring through AI-powered matching, 
            structured applications, and adaptive discovery.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.6s ease-out 0.3s both',
          }}>
            <Link to="/login?mode=register" className="btn btn-lg" style={{
              background: 'var(--white)',
              color: 'var(--black)',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              padding: '16px 40px',
            }}>
              Get Started Free →
            </Link>
            <Link to="/login" className="btn btn-lg" style={{
              background: 'transparent',
              color: 'var(--white)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '16px 40px',
            }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '100px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              Built for the Future of Hiring
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto' }}>
              Every feature designed to make job discovery intelligent, efficient, and transparent.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'all var(--transition-base)',
                cursor: 'default',
                animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Transform Hiring?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.125rem', marginBottom: '40px' }}>
            Join thousands of companies and candidates already using DJob.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login?mode=register&role=candidate" className="btn btn-lg" style={{
              background: 'var(--white)', color: 'var(--black)',
              borderRadius: 'var(--radius-full)', padding: '16px 40px', fontWeight: 700,
            }}>
              I'm a Candidate
            </Link>
            <Link to="/login?mode=register&role=recruiter" className="btn btn-lg" style={{
              background: 'transparent', color: 'var(--white)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius-full)', padding: '16px 40px', fontWeight: 700,
            }}>
              I'm a Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.3)',
      }}>
        <p>© 2026 DJob. Built for the modern job ecosystem.</p>
      </footer>
    </div>
  );
}
