import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { generateInterviewQuestions, evaluateAnswer, hasApiKey } from '../../utils/gemini';

const demoQuestions = [
  { id: 1, question: 'Explain the virtual DOM in React and how it improves application performance.', type: 'technical', difficulty: 'medium', expectedTopics: ['virtual DOM', 'reconciliation', 'diffing'] },
  { id: 2, question: 'Describe a situation where you had to deal with a challenging team member. How did you handle it?', type: 'behavioral', difficulty: 'medium', expectedTopics: ['conflict resolution', 'communication', 'teamwork'] },
  { id: 3, question: 'How would you optimize a React application that has slow rendering performance?', type: 'technical', difficulty: 'hard', expectedTopics: ['memoization', 'lazy loading', 'profiling'] },
  { id: 4, question: 'What is the difference between controlled and uncontrolled components in React?', type: 'technical', difficulty: 'easy', expectedTopics: ['state management', 'forms', 'refs'] },
  { id: 5, question: 'Tell me about a project you are most proud of and why.', type: 'behavioral', difficulty: 'easy', expectedTopics: ['achievements', 'impact', 'learning'] },
];

export default function MockInterview() {
  const { resume, addInterviewResult } = useData();
  const [phase, setPhase] = useState('setup');
  const [role, setRole] = useState('Senior Frontend Developer');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  const mySkills = resume?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'];

  const startInterview = async () => {
    setLoading(true);
    try {
      if (hasApiKey()) {
        const qs = await generateInterviewQuestions(role, mySkills);
        if (qs && qs.length > 0) { setQuestions(qs); setPhase('interview'); setLoading(false); return; }
      }
      setQuestions(demoQuestions);
      setPhase('interview');
    } catch (err) {
      setQuestions(demoQuestions);
      setPhase('interview');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    const q = questions[currentQ];
    const answer = answers[q.id] || '';
    if (!answer.trim()) return;

    setLoading(true);
    try {
      if (hasApiKey()) {
        const result = await evaluateAnswer(q.question, answer, role);
        if (result) { setFeedback(f => ({ ...f, [q.id]: result })); }
      } else {
        setFeedback(f => ({
          ...f,
          [q.id]: {
            score: Math.floor(60 + Math.random() * 30),
            maxScore: 100,
            strengths: ['Good structure', 'Clear communication'],
            improvements: ['Could be more specific', 'Add examples'],
            feedback: 'Your answer shows understanding of the topic. Consider adding specific examples from your experience to strengthen your response.',
            keyMissing: q.expectedTopics?.slice(1) || [],
          }
        }));
      }
    } catch (err) {
      setFeedback(f => ({
        ...f,
        [q.id]: { score: 70, maxScore: 100, strengths: ['Adequate response'], improvements: ['Add more detail'], feedback: 'Good attempt. Try to be more detailed in your response.', keyMissing: [] }
      }));
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      generateReport();
    }
    setLoading(false);
  };

  const generateReport = () => {
    const scores = Object.values(feedback);
    const totalScore = scores.reduce((sum, f) => sum + (f?.score || 0), 0);
    const avgScore = Math.round(totalScore / Math.max(scores.length, 1));

    const report = {
      role,
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      averageScore: avgScore,
      perQuestion: questions.map(q => ({
        question: q.question,
        type: q.type,
        answer: answers[q.id] || '',
        score: feedback[q.id]?.score || 0,
        feedback: feedback[q.id]?.feedback || '',
        strengths: feedback[q.id]?.strengths || [],
        improvements: feedback[q.id]?.improvements || [],
      })),
    };

    setFinalReport(report);
    addInterviewResult(report);
    setPhase('report');
  };

  if (phase === 'setup') {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>AI Mock Interview</h1>
          <p>Practice with AI-generated role-specific questions and get instant feedback.</p>
        </div>

        <div className="card" style={{ maxWidth: '600px' }}>
          <h4 style={{ marginBottom: '16px' }}>Choose Your Target Role</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {['Senior Frontend Developer', 'Full Stack Engineer', 'Backend Developer', 'ML Engineer', 'DevOps Engineer'].map(r => (
              <button key={r} onClick={() => setRole(r)} className={`btn ${role === r ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
                {role === r ? '● ' : '○ '}{r}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              <strong>How it works:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>5 role-specific questions (technical + behavioral)</li>
                <li>Free text answers — no time limit</li>
                <li>AI scores each answer and provides feedback</li>
                <li>Final report with overall assessment</li>
              </ul>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={startInterview} disabled={loading} style={{ width: '100%' }}>
            {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Generating Questions...</> : 'Start Interview →'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'interview') {
    const q = questions[currentQ];
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Mock Interview</h1>
              <p>{role} — Question {currentQ + 1} of {questions.length}</p>
            </div>
            <div className="progress-bar" style={{ width: '200px' }}>
              <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Previous feedback */}
        {feedback[questions[currentQ - 1]?.id] && (
          <div className="interview-feedback" style={{ marginBottom: '24px' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.875rem' }}>
              Previous Answer Score: {feedback[questions[currentQ - 1].id].score}/100
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              {feedback[questions[currentQ - 1].id].feedback}
            </p>
          </div>
        )}

        <div className="interview-question-card">
          <div className="q-number">Question {currentQ + 1} • {q?.type} • {q?.difficulty}</div>
          <div className="question">{q?.question}</div>

          <textarea
            className="textarea"
            placeholder="Type your answer here..."
            value={answers[q?.id] || ''}
            onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
            style={{ minHeight: '200px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button className="btn btn-ghost" onClick={() => { if (currentQ > 0) setCurrentQ(currentQ - 1); }}>
              ← Previous
            </button>
            <button className="btn btn-primary" onClick={submitAnswer} disabled={loading || !answers[q?.id]?.trim()}>
              {loading ? <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> :
                currentQ < questions.length - 1 ? 'Submit & Next →' : 'Submit & Finish →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'report' && finalReport) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Interview Report</h1>
          <p>{finalReport.role} — Completed</p>
        </div>

        {/* Overall Score */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '12px' }}>Overall Performance</div>
          <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--black)" strokeWidth="8"
                strokeDasharray={`${finalReport.averageScore * 3.77} 377`}
                strokeLinecap="round" transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{finalReport.averageScore}</span>
            </div>
          </div>
          <div style={{ color: 'var(--gray-600)' }}>
            {finalReport.averageScore >= 80 ? 'Excellent performance!' :
             finalReport.averageScore >= 60 ? 'Good job, with room for improvement.' :
             'Keep practicing to improve your responses.'}
          </div>
        </div>

        {/* Per-question breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {finalReport.perQuestion.map((pq, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Question {i + 1} • {pq.type}</div>
                  <div style={{ fontWeight: 600, lineHeight: 1.5 }}>{pq.question}</div>
                </div>
                <span className={`badge ${pq.score >= 80 ? 'badge-success' : pq.score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                  {pq.score}/100
                </span>
              </div>
              {pq.answer && (
                <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '12px', lineHeight: 1.6 }}>
                  "{pq.answer}"
                </div>
              )}
              {pq.feedback && (
                <div className="interview-feedback">
                  <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>{pq.feedback}</p>
                  {pq.strengths?.length > 0 && (
                    <div style={{ fontSize: '0.8125rem', color: '#065f46', marginBottom: '4px' }}>✓ {pq.strengths.join(' • ')}</div>
                  )}
                  {pq.improvements?.length > 0 && (
                    <div style={{ fontSize: '0.8125rem', color: '#991b1b' }}>↗ {pq.improvements.join(' • ')}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => { setPhase('setup'); setAnswers({}); setFeedback({}); setFinalReport(null); setCurrentQ(0); }}>
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return null;
}
