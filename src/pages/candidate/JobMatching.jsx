import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { matchJobsToCandidate, getSkillMatchDetails } from '../../utils/matching';

export default function JobMatching() {
  const { user } = useAuth();
  const { jobs, resume, addApplication, applications } = useData();
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');

  const mySkills = resume?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'Git'];
  const matchedJobs = matchJobsToCandidate(jobs, mySkills);
  
  const filtered = filter === 'all' ? matchedJobs :
    filter === 'high' ? matchedJobs.filter(j => j.matchScore >= 70) :
    filter === 'medium' ? matchedJobs.filter(j => j.matchScore >= 40 && j.matchScore < 70) :
    matchedJobs.filter(j => j.matchScore < 40);

  const handleApply = (jobId) => {
    const candidateId = user?.id || 'cand-1';
    const existing = applications.find(a => a.candidateId === candidateId && a.jobId === jobId);
    if (existing) return;
    addApplication({ candidateId, jobId, notes: '' });
  };

  const isApplied = (jobId) => {
    const candidateId = user?.id || 'cand-1';
    return applications.some(a => a.candidateId === candidateId && a.jobId === jobId);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Job Matching</h1>
        <p>Jobs ranked by match score against your skill profile using cosine similarity.</p>
      </div>

      {/* Filters */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {[
          { key: 'all', label: `All (${matchedJobs.length})` },
          { key: 'high', label: `High Match (${matchedJobs.filter(j => j.matchScore >= 70).length})` },
          { key: 'medium', label: `Medium (${matchedJobs.filter(j => j.matchScore >= 40 && j.matchScore < 70).length})` },
          { key: 'low', label: `Low (${matchedJobs.filter(j => j.matchScore < 40).length})` },
        ].map(f => (
          <button key={f.key} className={`tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Job List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((job, i) => (
            <div
              key={job.id}
              className="card"
              onClick={() => setSelectedJob(job)}
              style={{
                cursor: 'pointer',
                borderColor: selectedJob?.id === job.id ? 'var(--black)' : 'var(--gray-200)',
                animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ marginBottom: '4px' }}>{job.title}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{job.company} • {job.location}</p>
                </div>
                <div style={{
                  minWidth: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: job.matchScore >= 70 ? 'var(--black)' : job.matchScore >= 40 ? 'var(--gray-600)' : 'var(--gray-300)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                }}>
                  {job.matchScore}%
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-outline">{job.type}</span>
                <span className="badge badge-outline">{job.experience}</span>
                <span className="badge badge-outline">{job.salary}</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${job.matchScore}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Detail */}
        {selectedJob && (
          <div className="card animate-slide-in-left" style={{ position: 'sticky', top: '96px', maxHeight: 'calc(100vh - 128px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{selectedJob.title}</h3>
                <p style={{ color: 'var(--gray-500)' }}>{selectedJob.company}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="btn btn-ghost btn-icon sm">✕</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span className="badge badge-black">{selectedJob.matchScore}% Match</span>
              <span className="badge badge-gray">{selectedJob.location}</span>
              <span className="badge badge-gray">{selectedJob.salary}</span>
            </div>

            <p style={{ marginBottom: '20px', lineHeight: 1.7, color: 'var(--gray-600)' }}>{selectedJob.description}</p>

            {/* Skill Match Breakdown */}
            {(() => {
              const details = getSkillMatchDetails(mySkills, selectedJob.skills || []);
              return (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '0.9375rem' }}>Skill Match</h4>
                  {details.matched.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '6px' }}>✓ Matched</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {details.matched.map((s, i) => <span key={i} className="badge badge-success">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {details.missing.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '6px' }}>✗ Missing</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {details.missing.map((s, i) => <span key={i} className="badge badge-danger">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedJob.responsibilities && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '0.9375rem' }}>Responsibilities</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9375rem' }}>
                  {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            <button
              className={`btn ${isApplied(selectedJob.id) ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%' }}
              onClick={() => handleApply(selectedJob.id)}
              disabled={isApplied(selectedJob.id)}
            >
              {isApplied(selectedJob.id) ? '✓ Already Applied' : 'Apply Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
