import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Star, Sparkles, ArrowRight, User } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [latestProfile, setLatestProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/profile/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setLatestProfile(data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching latest profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProfile();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative z-10"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">RizzLab</span>
                </h1>
                <p className="text-xl text-white/60">Choose your path to dating success</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 relative z-10 w-full font-sans">
                {/* Option 1: Submit Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Link to="/submit" className="block h-full group">
                        <div className="glass-card p-8 h-full hover:bg-white/10 transition-colors border border-white/10 hover:border-pink-500/50">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">Submit Profile</h3>
                            <p className="text-white/60 mb-6">
                                Upload your dating profile screenshots to get community and AI feedback.
                            </p>
                            <div className="flex items-center text-cyan-400 font-medium">
                                Get Reviewed <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Option 2: Review Others */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to="/reviewer-dashboard" className="block h-full group">
                        <div className="glass-card p-8 h-full hover:bg-white/10 transition-colors border border-white/10 hover:border-purple-500/50">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">Review Others</h3>
                            <p className="text-white/60 mb-6">
                                Help others improve their profiles and earn reputation points.
                            </p>
                            <div className="flex items-center text-purple-400 font-medium">
                                Give Feedback <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Option 3: My Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/my-profile" className="block h-full group">
                        <div className="glass-card p-8 h-full hover:bg-white/10 transition-colors border border-white/10 hover:border-primary/50 relative overflow-hidden">
                            {/* Photo Background (Subtle) */}
                            {latestProfile?.photos?.[0] && (
                                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <img src={latestProfile.photos[0].url} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform overflow-hidden bg-gray-800">
                                    {latestProfile?.photos?.[0] ? (
                                        <img src={latestProfile.photos[0].url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">My Profile</h3>
                                <p className="text-white/60 mb-6 flex-grow">
                                    {latestProfile ? `Viewing ${latestProfile.user?.name || 'your'} latest profile version and feedback.` : 'Set up your dating profile to start getting feedback.'}
                                </p>
                                <div className="flex items-center text-primary font-medium">
                                    {latestProfile ? 'View History' : 'Go to Profile'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Option 4: AI Feedback / My Rizz */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/feedback" className="block h-full group">
                        <div className="glass-card p-8 h-full hover:bg-white/10 transition-colors border border-white/10 hover:border-yellow-500/50">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">My Rizz Score</h3>
                            <p className="text-white/60 mb-6">
                                Check your profile's performance and detailed AI analysis.
                            </p>
                            <div className="flex items-center text-yellow-400 font-medium">
                                View Results <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
