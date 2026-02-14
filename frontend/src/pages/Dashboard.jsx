import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Star, Sparkles, ArrowRight, User, MessageSquare, X, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [latestProfile, setLatestProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviews, setShowReviews] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [profileRes, reviewsRes] = await Promise.all([
                    fetch('http://localhost:8080/api/profile/history', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:8080/api/reviews/my-reviews', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData && profileData.length > 0) {
                        setLatestProfile(profileData[0]);
                    }
                }

                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const unreadCount = reviews.filter(r => !r.isRead).length;

    const markAsRead = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/reviews/${reviewId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReviews(reviews.map(r => r.id === reviewId ? { ...r, isRead: true } : r));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Header / Top Nav Elements */}
            <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
                <button
                    onClick={() => setShowReviews(true)}
                    className="relative p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group"
                >
                    <MessageSquare className="w-6 h-6 text-white/80 group-hover:text-pink-400" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0f1115] animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

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

            {/* Review Inbox Modal */}
            {showReviews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border-white/20"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-pink-500" />
                                    Review Inbox
                                </h2>
                                <p className="text-sm text-white/40">Feedback from the RizzLab community</p>
                            </div>
                            <button onClick={() => setShowReviews(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {reviews.length === 0 ? (
                                <div className="text-center py-20 opacity-40">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                                    <p>No reviews yet. Keep improving your profile!</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-6 rounded-2xl border transition-all ${!review.isRead ? 'bg-pink-500/5 border-pink-500/30' : 'bg-white/5 border-white/10'}`}
                                        onMouseEnter={() => !review.isRead && markAsRead(review.id)}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-bold">
                                                    {review.reviewer?.name?.charAt(0) || 'R'}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{review.reviewer?.name} reviewed your profile</p>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-pink-500 leading-none">{review.ratings}</div>
                                                <div className="text-[8px] uppercase font-bold text-white/40">Rizz Score</div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="w-3 h-3 text-yellow-400" />
                                                    <span className="text-[10px] uppercase font-bold text-white/40">Vibe Check</span>
                                                </div>
                                                <p className="text-sm font-medium">{review.feedback?.vibeCheck || 'Neutral'}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShieldCheck className="w-3 h-3 text-green-400" />
                                                    <span className="text-[10px] uppercase font-bold text-white/40">What Works</span>
                                                </div>
                                                <p className="text-xs text-white/80 line-clamp-2">{review.feedback?.whatWorks || 'No comments'}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-3 h-3 text-red-400" />
                                                    <span className="text-[10px] uppercase font-bold text-white/40">Needs Work</span>
                                                </div>
                                                <p className="text-xs text-white/80 line-clamp-2">{review.feedback?.whatDoesntWork || 'No comments'}</p>
                                            </div>
                                        </div>

                                        {review.feedback?.suggestions && review.feedback.suggestions.length > 0 && (
                                            <div className="bg-pink-500/10 p-4 rounded-xl border border-pink-500/20 italic text-sm text-pink-200">
                                                "💡 {review.feedback.suggestions[0]}"
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
