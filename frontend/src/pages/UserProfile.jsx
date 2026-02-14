import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, Star, ArrowRight, TrendingUp } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const historyRes = await fetch('http://localhost:8080/api/profile/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    setHistory(historyData);
                }
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Analytics Calculations
    const allReviews = history.flatMap(p => p.reviews || []);
    const avgScore = allReviews.length > 0
        ? (allReviews.reduce((acc, r) => acc + (r.ratings || 0), 0) / allReviews.length).toFixed(1)
        : '0.0';

    // Graph Data: Chronological (Oldest to Newest)
    const graphData = [...history]
        .reverse()
        .map(p => {
            if (!p.reviews || p.reviews.length === 0) return 0;
            return p.reviews.reduce((acc, r) => acc + (r.ratings || 0), 0) / p.reviews.length;
        });

    const maxScore = 100;
    const points = graphData.map((val, i) => {
        const x = (i / (graphData.length - 1 || 1)) * 100;
        const y = 100 - (val / maxScore) * 100;
        return `${x},${y}`;
    }).join(' ');

    const latestProfile = history[0];

    return (
        <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
            {/* Profile Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group ring-1 ring-white/10"
            >
                {latestProfile?.photos?.[0] ? (
                    <img
                        src={latestProfile.photos[0].url}
                        alt="Profile Hero"
                        className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <User className="w-20 h-20 text-white/10" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 md:p-12 flex flex-col justify-end">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white/10 overflow-hidden shadow-2xl bg-gray-900">
                                {latestProfile?.photos?.[0] ? (
                                    <img src={latestProfile.photos[0].url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-white mx-auto mt-6" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                    {latestProfile?.user?.name || "Your Rizz"}
                                </h1>
                                <div className="flex items-center gap-3 text-white/60">
                                    <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-pink-400">
                                        Active Version: {history.length}.0
                                    </span>
                                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                    <p className="text-sm font-medium">{allReviews.length} Total Reviews Received</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/submit" className="btn-primary py-4 px-8 text-lg flex items-center gap-3 group whitespace-nowrap">
                            Create New Version
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Analytics Column */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 border-primary/20 bg-primary/5 h-full relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Rizz Analytics
                            </h3>

                            <div className="mb-12">
                                <div className="text-6xl font-black text-white leading-none mb-1">{avgScore}</div>
                                <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Overall Avg Rizz Score</div>
                            </div>

                            {/* Chart Placeholder / SVG Sparkline */}
                            <div className="h-32 w-full relative group">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full preserve-3d"
                                    preserveAspectRatio="none"
                                >
                                    {/* Grid Lines */}
                                    <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                    <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                                    <line x1="0" y1="80" x2="100" y2="80" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />

                                    {/* Trend Path */}
                                    {graphData.length > 1 ? (
                                        <motion.polyline
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            points={points}
                                        />
                                    ) : (
                                        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.1" strokeDasharray="4 4" />
                                    )}

                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f1115]/80 backdrop-blur-sm rounded-lg pointer-events-none">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Score Change Trend</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                <span>Start</span>
                                <span>Recent</span>
                            </div>
                        </div>

                        {/* Background subtle score */}
                        <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/5 pointer-events-none">
                            {Math.floor(parseFloat(avgScore))}
                        </div>
                    </motion.div>
                </div>

                {/* History Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Improvement Timeline
                    </h2>

                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="text-center py-20 glass-card">
                                <p className="text-white/40 mb-4">No content yet. Start your journey by submitting a profile!</p>
                            </div>
                        ) : (
                            history.map((profile, idx) => {
                                const vAvg = profile.reviews?.length > 0
                                    ? (profile.reviews.reduce((acc, r) => acc + (r.ratings || 0), 0) / profile.reviews.length).toFixed(1)
                                    : '---';

                                return (
                                    <Link key={profile.id} to={`/profile/${profile.id}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="glass-card group hover:bg-white/[0.03] transition-all border-white/5 hover:border-white/20 p-5"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-800 overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/40 transition-all">
                                                        {profile.photos?.[0] && (
                                                            <img src={profile.photos[0].url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-bold text-xl tracking-tight">Version {history.length - idx}.0</h3>
                                                            {idx === 0 && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-white/40 font-medium">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {new Date(profile.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Star className="w-3.5 h-3.5 text-pink-500" />
                                                                {profile.reviews?.length || 0} Reviews
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="text-right hidden md:block">
                                                        <div className="text-2xl font-black text-white/90 group-hover:text-primary transition-colors">{vAvg}</div>
                                                        <div className="text-[9px] uppercase font-black text-white/30 tracking-widest">Version Avg</div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                                                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
