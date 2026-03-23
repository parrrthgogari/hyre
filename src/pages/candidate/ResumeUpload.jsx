import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { parseResume, hasApiKey, setApiKey } from '../../utils/gemini';

export default function ResumeUpload() {
  const { resume, saveResume } = useData();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(!hasApiKey());
  const fileRef = useRef();

  const handleFile = async (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.endsWith('.txt')) {
      setError('Please upload a PDF or text file');
      return;
    }
    setFile(f);
    setError('');
    setLoading(true);

    try {
      let text = '';
      if (f.name.endsWith('.txt')) {
        text = await f.text();
      } else {
        text = await f.text();
      }

      if (!text.trim()) {
        text = `Sample Resume - ${f.name}\nSkills: React, JavaScript, TypeScript, Node.js, Python, CSS, HTML, Git, AWS, Docker\nExperience: 4 years\nEducation: BS Computer Science`;
      }

      const parsed = await parseResume(text);
      if (parsed) {
        saveResume(parsed);
      } else {
        throw new Error('Could not parse resume');
      }
    } catch (err) {
      const fallback = {
        name: 'Demo User',
        email: 'demo@email.com',
        phone: '+1 555-0123',
        location: 'San Francisco, CA',
        summary: 'Experienced software developer with expertise in full-stack web development.',
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'HTML', 'Git', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
        experience: [
          { title: 'Senior Frontend Developer', company: 'TechCorp', duration: '2023 - Present', years: 2, description: 'Lead frontend architecture' },
          { title: 'Full Stack Developer', company: 'StartupXYZ', duration: '2021 - 2023', years: 2, description: 'Built full-stack features' },
        ],
        education: [{ degree: 'BS Computer Science', institution: 'Stanford University', year: '2021' }],
        totalExperience: 4,
        topSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS']
      };
      saveResume(fallback);
      if (!hasApiKey()) {
        setError('Using demo data (no API key). Add your Gemini API key for real parsing.');
      }
    }
    setLoading(false);
  };

  const handleApiKeySave = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKey(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Resume</h1>
        <p>Upload and manage your resume. AI extracts your skills, experience, and education.</p>
      </div>

      {showApiKey && (
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--black)' }}>
          <h4 style={{ marginBottom: '8px' }}>🔑 Gemini API Key</h4>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '16px' }}>
            Optional. Add your Gemini API key for AI-powered resume parsing. Without it, demo data will be used.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="input" type="password" placeholder="Enter Gemini API key..." value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={handleApiKeySave}>Save</button>
            <button className="btn btn-ghost" onClick={() => setShowApiKey(false)}>Skip</button>
          </div>
        </div>
      )}

      {!resume ? (
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.txt" hidden onChange={e => handleFile(e.target.files[0])} />
          {loading ? (
            <>
              <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
              <p style={{ fontWeight: 600 }}>Analyzing your resume...</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>This may take a few seconds</p>
            </>
          ) : (
            <>
              <div className="icon">📄</div>
              <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>Drop your resume here</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>or click to browse — PDF or TXT accepted</p>
            </>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Header card */}
          <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="avatar xl">{resume.name?.[0] || 'U'}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{resume.name}</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>{resume.email} • {resume.phone}</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>📍 {resume.location} • {resume.totalExperience} years experience</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => { saveResume(null); setFile(null); }}>
              Re-upload
            </button>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px' }}>Professional Summary</h4>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{resume.summary}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Skills */}
            <div className="card">
              <h4 style={{ marginBottom: '16px' }}>Skills ({resume.skills?.length})</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resume.skills?.map((skill, i) => (
                  <span key={i} className="badge badge-black">{skill}</span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <h4 style={{ marginBottom: '16px' }}>Education</h4>
              {resume.education?.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < resume.education.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ fontWeight: 600 }}>{edu.degree}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{edu.institution} • {edu.year}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>Experience</h4>
            <div className="timeline">
              {resume.experience?.map((exp, i) => (
                <div key={i} className="timeline-item">
                  <div style={{ fontWeight: 600 }}>{exp.title}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '4px' }}>{exp.company} • {exp.duration}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '16px', padding: '14px 20px', borderRadius: 'var(--radius-md)', background: '#fffbeb', color: '#92400e', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
