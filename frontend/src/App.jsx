import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ProfileSubmission from './pages/ProfileSubmission';
import ReviewerPreferences from './pages/ReviewerPreferences';
import SubmissionConfirmation from './pages/SubmissionConfirmation';
import FeedbackDashboard from './pages/FeedbackDashboard';
import VersionHistory from './pages/VersionHistory';
import CreateNewVersion from './pages/CreateNewVersion';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-white overflow-x-hidden">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<ProfileSubmission />} />
            <Route path="/submission" element={<ProfileSubmission />} />
            <Route path="/preferences" element={<ReviewerPreferences />} />
            <Route path="/confirmation" element={<SubmissionConfirmation />} />
            <Route path="/dashboard" element={<FeedbackDashboard />} />
            <Route path="/history" element={<VersionHistory />} />
            <Route path="/new-version" element={<CreateNewVersion />} />
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
