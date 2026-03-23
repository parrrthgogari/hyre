import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { statusColors, applicationStatuses } from '../../utils/mockData';

export default function Pipeline() {
  const { jobs, applications, candidates, updateApplicationStatus } = useData();
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [dragItem, setDragItem] = useState(null);

  const filteredApps = selectedJobId === 'all'
    ? applications
    : applications.filter(a => a.jobId === selectedJobId);

  const handleDragStart = (app) => {
    setDragItem(app);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (dragItem && dragItem.status !== newStatus) {
      updateApplicationStatus(dragItem.id, newStatus);
    }
    setDragItem(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Pipeline</h1>
            <p>Drag candidates between stages to manage your hiring pipeline.</p>
          </div>
          <select className="input" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)} style={{ width: '280px' }}>
            <option value="all">All Job Postings</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
      </div>

      <div className="kanban-board">
        {applicationStatuses.map(status => {
          const sc = statusColors[status];
          const columnApps = filteredApps.filter(a => a.status === status);

          return (
            <div
              key={status}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, status)}
            >
              <div className="kanban-column-header">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.text, display: 'inline-block' }} />
                  {sc.label}
                </h4>
                <span className="kanban-column-count">{columnApps.length}</span>
              </div>

              {columnApps.map(app => {
                const candidate = candidates.find(c => c.id === app.candidateId);
                const job = jobs.find(j => j.id === app.jobId);

                return (
                  <div
                    key={app.id}
                    className={`kanban-card ${dragItem?.id === app.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(app)}
                    onDragEnd={() => setDragItem(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div className="avatar sm">{candidate?.name?.[0] || '?'}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{candidate?.name || 'Unknown'}</div>
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{candidate?.title}</div>
                      </div>
                    </div>

                    {selectedJobId === 'all' && (
                      <div style={{
                        padding: '6px 10px',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--gray-600)',
                        marginBottom: '8px',
                      }}>
                        {job?.title} @ {job?.company}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {candidate?.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="badge badge-outline" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>{s}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>{app.appliedDate}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {status !== 'offered' && status !== 'rejected' && (
                          <>
                            <button className="btn btn-ghost btn-sm" onClick={() => updateApplicationStatus(app.id, applicationStatuses[Math.min(applicationStatuses.indexOf(status) + 1, applicationStatuses.length - 2)])} style={{ padding: '4px 8px', fontSize: '0.6875rem' }}>
                              Advance →
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => updateApplicationStatus(app.id, 'rejected')} style={{ padding: '4px 8px', fontSize: '0.6875rem', color: '#991b1b' }}>
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnApps.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.8125rem' }}>
                  Drop candidates here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
