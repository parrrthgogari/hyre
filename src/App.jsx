import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CandidateDashboard from './pages/candidate/Dashboard';
import ResumeUpload from './pages/candidate/ResumeUpload';
import SkillMap from './pages/candidate/SkillMap';
import JobMatching from './pages/candidate/JobMatching';
import SkillGap from './pages/candidate/SkillGap';
import ApplicationTracker from './pages/candidate/ApplicationTracker';
import JobChance from './pages/candidate/JobChance';
import MockInterview from './pages/candidate/MockInterview';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import JDBuilder from './pages/recruiter/JDBuilder';
import JDScorer from './pages/recruiter/JDScorer';
import CandidateRanking from './pages/recruiter/CandidateRanking';
import EmployeeBenchmark from './pages/recruiter/EmployeeBenchmark';
import Pipeline from './pages/recruiter/Pipeline';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const isAuthPage = (path) => path === '/' || path === '/login';

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} /> : <Login />} />

          {/* Candidate Routes */}
          <Route path="/candidate" element={<ProtectedRoute role="candidate"><div className="page-content"><CandidateDashboard /></div></ProtectedRoute>} />
          <Route path="/candidate/resume" element={<ProtectedRoute role="candidate"><div className="page-content"><ResumeUpload /></div></ProtectedRoute>} />
          <Route path="/candidate/skills" element={<ProtectedRoute role="candidate"><div className="page-content"><SkillMap /></div></ProtectedRoute>} />
          <Route path="/candidate/jobs" element={<ProtectedRoute role="candidate"><div className="page-content"><JobMatching /></div></ProtectedRoute>} />
          <Route path="/candidate/gap" element={<ProtectedRoute role="candidate"><div className="page-content"><SkillGap /></div></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute role="candidate"><div className="page-content"><ApplicationTracker /></div></ProtectedRoute>} />
          <Route path="/candidate/chance" element={<ProtectedRoute role="candidate"><div className="page-content"><JobChance /></div></ProtectedRoute>} />
          <Route path="/candidate/interview" element={<ProtectedRoute role="candidate"><div className="page-content"><MockInterview /></div></ProtectedRoute>} />

          {/* Recruiter Routes */}
          <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><div className="page-content"><RecruiterDashboard /></div></ProtectedRoute>} />
          <Route path="/recruiter/jd-builder" element={<ProtectedRoute role="recruiter"><div className="page-content"><JDBuilder /></div></ProtectedRoute>} />
          <Route path="/recruiter/jd-scorer" element={<ProtectedRoute role="recruiter"><div className="page-content"><JDScorer /></div></ProtectedRoute>} />
          <Route path="/recruiter/candidates" element={<ProtectedRoute role="recruiter"><div className="page-content"><CandidateRanking /></div></ProtectedRoute>} />
          <Route path="/recruiter/benchmark" element={<ProtectedRoute role="recruiter"><div className="page-content"><EmployeeBenchmark /></div></ProtectedRoute>} />
          <Route path="/recruiter/pipeline" element={<ProtectedRoute role="recruiter"><div className="page-content"><Pipeline /></div></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
