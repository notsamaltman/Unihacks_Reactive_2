import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ProfileSubmission from './pages/ProfileSubmission';
import ReviewerPreferences from './pages/ReviewerPreferences';
import SubmissionConfirmation from './pages/SubmissionConfirmation';
import Dashboard from './pages/Dashboard';
import FeedbackDashboard from './pages/FeedbackDashboard';
import VersionHistory from './pages/VersionHistory';
import CreateNewVersion from './pages/CreateNewVersion';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ReviewInterface from './pages/ReviewInterface';
import UserProfile from './pages/UserProfile';
import ProfileDetail from './pages/ProfileDetail';
import Navbar from './components/Navbar';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-white overflow-x-hidden">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<ProtectedRoute><ProfileSubmission /></ProtectedRoute>} />
            <Route path="/submission" element={<ProtectedRoute><ProfileSubmission /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><ReviewerPreferences /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><SubmissionConfirmation /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackDashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><VersionHistory /></ProtectedRoute>} />
            <Route path="/new-version" element={<ProtectedRoute><CreateNewVersion /></ProtectedRoute>} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reviewer-dashboard" element={<ProtectedRoute><ReviewerDashboard /></ProtectedRoute>} />
            <Route path="/review/:id" element={<ProtectedRoute><ReviewInterface /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="py-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} RizzLab. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
