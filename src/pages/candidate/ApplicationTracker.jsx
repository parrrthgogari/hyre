import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { statusColors, applicationStatuses } from '../../utils/mockData';

export default function ApplicationTracker() {
  const { user } = useAuth();
  const { applications, jobs, updateApplicationStatus } = useData();
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState('list');

  const myApps = applications.filter(a => a.candidateId === user?.id || a.candidateId === 'cand-1');

  const filtered = filterStatus === 'all' ? myApps : myApps.filter(a => a.status === filterStatus);

  const statusCounts = applicationStatuses.reduce((acc, s) => {
    acc[s] = myApps.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Application Tracker</h1>
            <p>Track all your job applications across the pipeline.</p>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('list')}>List</button>
            <button className={`btn btn-sm ${view === 'pipeline' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('pipeline')}>Pipeline</button>
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-4 stagger-children" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {applicationStatuses.map(s => {
          const sc = statusColors[s];
          return (
            <div key={s} className="stat-card" onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)} style={{ cursor: 'pointer', borderColor: filterStatus === s ? 'var(--black)' : 'var(--gray-200)' }}>
              <span className="stat-label">{sc.label}</span>
              <span className="stat-value">{statusCounts[s] || 0}</span>
            </div>
          );
        })}
      </div>

      {view === 'list' ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => {
                const job = jobs.find(j => j.id === app.jobId);
                const sc = statusColors[app.status];
                return (
                  <tr key={app.id} style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}>
                    <td style={{ fontWeight: 600 }}>{job?.title || 'Unknown'}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{job?.company || '—'}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{app.appliedDate}</td>
                    <td>
                      <span className="badge" style={{ background: sc?.bg, color: sc?.text }}>{sc?.label}</span>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{app.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray-400)' }}>
              No applications found
            </div>
          )}
        </div>
      ) : (
        /* Pipeline View */
        <div className="kanban-board">
          {applicationStatuses.map(status => {
            const sc = statusColors[status];
            const apps = myApps.filter(a => a.status === status);
            return (
              <div key={status} className="kanban-column">
                <div className="kanban-column-header">
                  <h4>{sc.label}</h4>
                  <span className="kanban-column-count">{apps.length}</span>
                </div>
                {apps.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={app.id} className="kanban-card">
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '4px' }}>{job?.title}</div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem', marginBottom: '8px' }}>{job?.company}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{app.appliedDate}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h4 style={{ marginBottom: '20px' }}>Application Timeline</h4>
        <div className="timeline">
          {myApps.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5).map((app, i) => {
            const job = jobs.find(j => j.id === app.jobId);
            const sc = statusColors[app.status];
            return (
              <div key={app.id} className="timeline-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{job?.title}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{job?.company} • {app.appliedDate}</div>
                  </div>
                  <span className="badge" style={{ background: sc?.bg, color: sc?.text }}>{sc?.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
