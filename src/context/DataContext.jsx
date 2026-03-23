import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sampleJobs, sampleCandidates, sampleApplications, sampleEmployeeBenchmarks } from '../utils/mockData';

const DataContext = createContext(null);

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(`djob_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  localStorage.setItem(`djob_${key}`, JSON.stringify(value));
}

export function DataProvider({ children }) {
  const [jobs, setJobs] = useState(() => loadState('jobs', sampleJobs));
  const [applications, setApplications] = useState(() => loadState('applications', sampleApplications));
  const [candidates, setCandidates] = useState(() => loadState('candidates', sampleCandidates));
  const [benchmarks, setBenchmarks] = useState(() => loadState('benchmarks', sampleEmployeeBenchmarks));
  const [resume, setResume] = useState(() => loadState('resume', null));
  const [interviewResults, setInterviewResults] = useState(() => loadState('interviewResults', []));

  useEffect(() => { saveState('jobs', jobs); }, [jobs]);
  useEffect(() => { saveState('applications', applications); }, [applications]);
  useEffect(() => { saveState('candidates', candidates); }, [candidates]);
  useEffect(() => { saveState('benchmarks', benchmarks); }, [benchmarks]);
  useEffect(() => { saveState('resume', resume); }, [resume]);
  useEffect(() => { saveState('interviewResults', interviewResults); }, [interviewResults]);

  const addJob = useCallback((job) => {
    const newJob = { ...job, id: 'job-' + Date.now(), posted: new Date().toISOString().split('T')[0], applicants: 0, status: 'active' };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  }, []);

  const updateJob = useCallback((id, updates) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const addApplication = useCallback((app) => {
    const newApp = { ...app, id: 'app-' + Date.now(), appliedDate: new Date().toISOString().split('T')[0], status: 'applied' };
    setApplications(prev => [...prev, newApp]);
    return newApp;
  }, []);

  const updateApplicationStatus = useCallback((id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const getJobApplications = useCallback((jobId) => {
    return applications.filter(a => a.jobId === jobId);
  }, [applications]);

  const getCandidateApplications = useCallback((candidateId) => {
    return applications.filter(a => a.candidateId === candidateId);
  }, [applications]);

  const saveResume = useCallback((parsedResume) => {
    setResume(parsedResume);
  }, []);

  const addInterviewResult = useCallback((result) => {
    const newResult = { ...result, id: 'int-' + Date.now(), date: new Date().toISOString() };
    setInterviewResults(prev => [newResult, ...prev]);
    return newResult;
  }, []);

  const addCandidate = useCallback((candidate) => {
    const newCandidate = { ...candidate, id: 'cand-' + Date.now(), resumeParsed: true };
    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  }, []);

  const addBenchmark = useCallback((benchmark) => {
    const newB = { ...benchmark, id: 'emp-' + Date.now() };
    setBenchmarks(prev => [...prev, newB]);
    return newB;
  }, []);

  return (
    <DataContext.Provider value={{
      jobs, addJob, updateJob,
      applications, addApplication, updateApplicationStatus, getJobApplications, getCandidateApplications,
      candidates, addCandidate,
      benchmarks, addBenchmark,
      resume, saveResume,
      interviewResults, addInterviewResult,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
