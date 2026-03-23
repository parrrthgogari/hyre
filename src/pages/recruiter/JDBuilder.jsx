import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { generateJD, hasApiKey } from '../../utils/gemini';

export default function JDBuilder() {
  const { addJob } = useData();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    role: '', company: '', department: '', location: '', type: 'Full-Time',
    experience: '', salary: '', technologies: '', teamSize: '', notes: ''
  });
  const [generatedJD, setGeneratedJD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const steps = [
    { title: 'Basic Info', fields: ['role', 'company', 'department', 'location'] },
    { title: 'Requirements', fields: ['type', 'experience', 'salary', 'technologies'] },
    { title: 'Details', fields: ['teamSize', 'notes'] },
    { title: 'Review & Generate', fields: [] },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (hasApiKey()) {
        const jd = await generateJD(form);
        if (jd) { setGeneratedJD(jd); setLoading(false); return; }
      }
      setGeneratedJD({
        title: form.role || 'Software Engineer',
        company: form.company || 'Tech Company',
        location: form.location || 'Remote',
        type: form.type,
        experience: form.experience || '3+ years',
        salary: form.salary || '$100,000 - $140,000',
        summary: `We're looking for a ${form.role || 'Software Engineer'} to join our ${form.department || 'Engineering'} team at ${form.company || 'our company'}. This role involves building and maintaining high-quality software solutions.`,
        responsibilities: ['Design and implement new features', 'Write clean, maintainable code', 'Collaborate with cross-functional teams', 'Participate in code reviews', 'Contribute to technical documentation'],
        requirements: [`${form.experience || '3+'} years of relevant experience`, `Proficiency in ${form.technologies || 'relevant technologies'}`, 'Strong problem-solving skills', 'Excellent communication abilities'],
        niceToHave: ['Experience with cloud platforms', 'Open source contributions', 'Mentoring experience'],
        skills: form.technologies ? form.technologies.split(',').map(s => s.trim()) : ['JavaScript', 'React', 'Node.js', 'Git'],
        benefits: ['Competitive salary', 'Health insurance', 'Remote work flexibility', 'Learning budget', 'Stock options'],
        fullDescription: `Join ${form.company || 'our team'} as a ${form.role || 'Software Engineer'} and help build the future of technology.`,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePublish = () => {
    if (!generatedJD) return;
    addJob({
      title: generatedJD.title,
      company: generatedJD.company,
      location: generatedJD.location,
      type: generatedJD.type,
      salary: generatedJD.salary,
      experience: generatedJD.experience,
      skills: generatedJD.skills || [],
      description: generatedJD.summary,
      responsibilities: generatedJD.responsibilities,
      requirements: generatedJD.requirements,
    });
    setPublished(true);
  };

  const fieldLabels = {
    role: 'Job Title', company: 'Company Name', department: 'Department', location: 'Location',
    type: 'Employment Type', experience: 'Required Experience', salary: 'Salary Range',
    technologies: 'Key Technologies (comma-separated)', teamSize: 'Team Size', notes: 'Additional Notes',
  };

  if (published) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✓</div>
        <h2 style={{ marginBottom: '12px' }}>Job Published!</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>Your job posting is now live and visible to candidates.</p>
        <button className="btn btn-primary" onClick={() => { setPublished(false); setStep(0); setForm({ role: '', company: '', department: '', location: '', type: 'Full-Time', experience: '', salary: '', technologies: '', teamSize: '', notes: '' }); setGeneratedJD(null); }}>
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>JD Builder</h1>
        <p>Create professional job descriptions with AI assistance.</p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }} onClick={() => setStep(i)}>
            <div style={{ height: '4px', borderRadius: '2px', background: i <= step ? 'var(--black)' : 'var(--gray-200)', transition: 'background var(--transition-base)' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: i === step ? '700' : '500', color: i <= step ? 'var(--black)' : 'var(--gray-400)' }}>{s.title}</div>
          </div>
        ))}
      </div>

      {step < 3 ? (
        <div className="card animate-fade-in" style={{ maxWidth: '600px' }}>
          <h4 style={{ marginBottom: '24px' }}>{steps[step].title}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps[step].fields.map(field => (
              <div key={field} className="input-group">
                <label>{fieldLabels[field]}</label>
                {field === 'type' ? (
                  <select className="input" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}>
                    <option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Internship</option>
                  </select>
                ) : field === 'notes' ? (
                  <textarea className="textarea" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`} />
                ) : (
                  <input className="input" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next →</button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {!generatedJD ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <h4 style={{ marginBottom: '16px' }}>Ready to Generate</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                {Object.entries(form).filter(([k, v]) => v).map(([k, v]) => (
                  <span key={k} className="badge badge-gray">{fieldLabels[k]}: {v}</span>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={loading}>
                {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Generating with AI...</> : '✦ Generate JD'}
              </button>
            </div>
          ) : (
            <div>
              <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3>{generatedJD.title}</h3>
                    <p style={{ color: 'var(--gray-500)' }}>{generatedJD.company} • {generatedJD.location}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={handleGenerate}>Regenerate</button>
                    <button className="btn btn-primary btn-sm" onClick={handlePublish}>Publish →</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <span className="badge badge-black">{generatedJD.type}</span>
                  <span className="badge badge-gray">{generatedJD.experience}</span>
                  <span className="badge badge-gray">{generatedJD.salary}</span>
                </div>

                <p style={{ marginBottom: '24px', lineHeight: 1.7, color: 'var(--gray-600)' }}>{generatedJD.summary}</p>

                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Responsibilities</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--gray-600)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {generatedJD.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>

                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Requirements</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--gray-600)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {generatedJD.requirements?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>

                {generatedJD.niceToHave?.length > 0 && (
                  <>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Nice to Have</h4>
                    <ul style={{ paddingLeft: '20px', color: 'var(--gray-600)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {generatedJD.niceToHave.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </>
                )}

                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Required Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {generatedJD.skills?.map((s, i) => <span key={i} className="badge badge-black">{s}</span>)}
                </div>

                {generatedJD.benefits?.length > 0 && (
                  <>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Benefits</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {generatedJD.benefits.map((b, i) => <span key={i} className="badge badge-gray">{b}</span>)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
