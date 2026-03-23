import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { cosineSimilarity } from '../../utils/matching';

export default function EmployeeBenchmark() {
  const { jobs, candidates, benchmarks, addBenchmark } = useData();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBenchmark, setNewBenchmark] = useState({ name: '', skills: '', experience: '', performance: '' });

  const job = jobs.find(j => j.id === selectedJobId);
  const jobBenchmarks = benchmarks.filter(b => b.jobId === selectedJobId);
  const candidate = candidates.find(c => c.id === selectedCandidateId);

  const handleAddBenchmark = () => {
    addBenchmark({
      jobId: selectedJobId,
      name: newBenchmark.name,
      skills: newBenchmark.skills.split(',').map(s => s.trim()),
      experience: parseInt(newBenchmark.experience) || 0,
      performance: parseInt(newBenchmark.performance) || 80,
    });
    setNewBenchmark({ name: '', skills: '', experience: '', performance: '' });
    setShowAddForm(false);
  };

  const getComparison = (candidate, benchmark) => {
    if (!candidate || !benchmark) return null;
    const skillSim = cosineSimilarity(candidate.skills || [], benchmark.skills || []);
    const expRatio = Math.min(100, Math.round((candidate.experience / Math.max(benchmark.experience, 1)) * 100));
    return { skillSim, expRatio, overall: Math.round((skillSim + expRatio) / 2) };
  };

  const RadarChart = ({ data, labels, size = 250 }) => {
    const cx = size / 2, cy = size / 2, maxR = size / 2 - 30;
    const n = labels.length;
    const angles = labels.map((_, i) => (i / n) * Math.PI * 2 - Math.PI / 2);
    
    const getPoint = (angle, value) => ({
      x: cx + Math.cos(angle) * maxR * (value / 100),
      y: cy + Math.sin(angle) * maxR * (value / 100),
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[20, 40, 60, 80, 100].map(level => (
          <polygon key={level}
            points={angles.map(a => `${cx + Math.cos(a) * maxR * (level/100)},${cy + Math.sin(a) * maxR * (level/100)}`).join(' ')}
            fill="none" stroke="var(--gray-200)" strokeWidth="1"
          />
        ))}
        {angles.map((a, i) => (
          <g key={i}>
            <line x1={cx} y1={cy} x2={cx + Math.cos(a) * maxR} y2={cy + Math.sin(a) * maxR} stroke="var(--gray-200)" strokeWidth="1" />
            <text x={cx + Math.cos(a) * (maxR + 20)} y={cy + Math.sin(a) * (maxR + 20)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fontWeight="600" fill="var(--gray-500)">
              {labels[i]}
            </text>
          </g>
        ))}
        {data.map((series, si) => {
          const points = series.values.map((v, i) => getPoint(angles[i], v));
          return (
            <g key={si}>
              <polygon
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill={series.color + '20'} stroke={series.color} strokeWidth="2"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={series.color} />
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Employee Benchmark</h1>
        <p>Compare candidates to your existing employee benchmarks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="input-group">
          <label>Job Posting</label>
          <select className="input" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Compare Candidate</label>
          <select className="input" value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)}>
            <option value="">— Select candidate —</option>
            {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.title})</option>)}
          </select>
        </div>
      </div>

      {/* Benchmarks List */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {jobBenchmarks.map((b, i) => (
          <div key={b.id} className="card" style={{ flex: '1 1 calc(50% - 12px)', minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{b.name}</div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{b.experience} yrs • Performance: {b.performance}%</div>
              </div>
              <span className="badge badge-black">Benchmark</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {b.skills?.map((s, j) => <span key={j} className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{s}</span>)}
            </div>
          </div>
        ))}
        <button className="card" onClick={() => setShowAddForm(!showAddForm)} style={{ flex: '1 1 calc(50% - 12px)', minWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--gray-300)', color: 'var(--gray-400)', fontWeight: 600 }}>
          + Add Benchmark Employee
        </button>
      </div>

      {showAddForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '24px', maxWidth: '500px' }}>
          <h4 style={{ marginBottom: '16px' }}>Add Benchmark Employee</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input className="input" placeholder="Employee Name" value={newBenchmark.name} onChange={e => setNewBenchmark(f => ({ ...f, name: e.target.value }))} />
            <input className="input" placeholder="Skills (comma-separated)" value={newBenchmark.skills} onChange={e => setNewBenchmark(f => ({ ...f, skills: e.target.value }))} />
            <input className="input" type="number" placeholder="Years of Experience" value={newBenchmark.experience} onChange={e => setNewBenchmark(f => ({ ...f, experience: e.target.value }))} />
            <input className="input" type="number" placeholder="Performance Score (0-100)" value={newBenchmark.performance} onChange={e => setNewBenchmark(f => ({ ...f, performance: e.target.value }))} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleAddBenchmark}>Add</button>
              <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison */}
      {candidate && jobBenchmarks.length > 0 && (
        <div className="card animate-fade-in">
          <h4 style={{ marginBottom: '24px' }}>Comparison: {candidate.name} vs Benchmarks</h4>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <RadarChart
              labels={['Skills Match', 'Experience', 'Technical', 'Seniority', 'Coverage']}
              data={[
                { values: [getComparison(candidate, jobBenchmarks[0])?.skillSim || 0, getComparison(candidate, jobBenchmarks[0])?.expRatio || 0, 75, 65, 70], color: '#000000' },
                { values: [100, 100, jobBenchmarks[0]?.performance || 80, 90, 95], color: '#a3a3a3' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.875rem' }}>
            <span><span style={{ width: '12px', height: '12px', background: '#000', borderRadius: '50%', display: 'inline-block', marginRight: '6px' }} />{candidate.name}</span>
            <span><span style={{ width: '12px', height: '12px', background: '#a3a3a3', borderRadius: '50%', display: 'inline-block', marginRight: '6px' }} />Benchmark</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
            {jobBenchmarks.map(b => {
              const comp = getComparison(candidate, b);
              return (
                <div key={b.id} style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>vs {b.name}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{comp?.overall}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>similarity</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
