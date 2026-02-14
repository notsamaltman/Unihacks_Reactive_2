import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, TrendingUp, User, ArrowRight, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewerDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/reviews/matching', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQueue(data);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);



    return (
        <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Reviewer Dashboard</h1>
                    <p className="text-white/60">Help others optimize their profiles and earn karma.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/reviews-received" className="text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20">
                        Reviews Received
                    </Link>
                    <Link to="/my-reviews" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                        My Reviews
                    </Link>
                </div>
            </div>



            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                Profiles for You
            </h2>

            {/* Profile Queue */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-white/40">Finding matches for your expertise...</p>
                </div>
            ) : queue.length === 0 ? (
                <div className="glass-card p-12 text-center text-white/40 border-dashed border-2 border-white/5">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No profiles currently match your preferences.</p>
                    <p className="text-sm">Try updating your own profile or check back later!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queue.map((profile, idx) => (
                        <motion.div
                            key={profile.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3 }}
                            className="glass-card overflow-hidden group hover:border-pink-500/30 transition-all flex flex-col"
                        >
                            <div className="aspect-[4/3] bg-gray-800 relative">
                                {profile.photos && profile.photos.length > 0 ? (
                                    <img
                                        src={profile.photos[0].url}
                                        alt={profile.user.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="font-bold text-lg">{profile.user.name}, {profile.user.age}</h3>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                                            {profile.ReviewerPreference.preferredIntent.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1 tracking-wider">Review Request</p>
                                    <p className="text-sm text-white/80 line-clamp-2 italic">
                                        "{profile.ReviewerPreference.preferredDescription || "I'm looking for feedback on my overall vibe!"}"
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <Link to={`/review/${profile.id}`} className="btn-primary w-full py-2 flex items-center justify-center gap-2 group-hover:bg-pink-600 transition-colors">
                                        Start Review
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div >
    );
};

export default ReviewerDashboard;
