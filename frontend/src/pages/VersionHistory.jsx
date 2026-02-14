import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus, MessageSquare, Zap, Star } from 'lucide-react';

const VersionHistory = () => {
    const navigate = useNavigate();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/profile/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setVersions(data);
                }
            } catch (error) {
                console.error('Error fetching profile history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return (
        <div className="pt-32 text-center text-white/40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your profile timeline...</p>
        </div>
    );

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Version History</h1>
                    <p className="text-white/60">Track your profile improvements over time.</p>
                </div>
                <Link to="/submit" className="btn-primary flex items-center gap-2">
                    Create New Version
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 md:ml-8 space-y-12">
                {versions.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                        <Calendar className="w-16 h-16 mx-auto mb-4" />
                        <p>No profile versions found. Start by submitting your first profile!</p>
                    </div>
                ) : (
                    versions.map((ver, idx) => {
                        const nextVer = versions[idx + 1];
                        const avgScore = ver.reviews?.length > 0
                            ? (ver.reviews.reduce((acc, r) => acc + (r.ratings || 0), 0) / ver.reviews.length).toFixed(1)
                            : 0;
                        const prevAvg = nextVer?.reviews?.length > 0
                            ? (nextVer.reviews.reduce((acc, r) => acc + (r.ratings || 0), 0) / nextVer.reviews.length).toFixed(1)
                            : 0;
                        const change = prevAvg > 0 ? (avgScore - prevAvg).toFixed(1) : 0;

                        return (
                            <motion.div
                                key={ver.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-8 md:pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#0f1115] ${idx === 0 ? 'bg-primary animate-pulse' : 'bg-white/30'
                                    }`}></div>

                                <div className={`glass-card p-6 transition-all ${idx === 0 ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' : 'hover:bg-white/5'
                                    }`}>
                                    <div className="flex flex-col md:flex-row justify-between gap-8">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">Version {versions.length - idx}.0</h3>
                                                {idx === 0 && (
                                                    <span className="text-[10px] uppercase font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 tracking-widest">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(ver.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>

                                            <div className="flex gap-6 text-sm mb-6">
                                                <div>
                                                    <span className="block text-white/40 text-[10px] uppercase font-bold tracking-wider">Photos</span>
                                                    <span className="font-medium">{ver.photos?.length || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-white/40 text-[10px] uppercase font-bold tracking-wider">Bio Preview</span>
                                                    <span className="font-medium italic text-white/60">"{ver.bio?.substring(0, 30)}..."</span>
                                                </div>
                                            </div>

                                            {/* Nested Reviews Summary */}
                                            {ver.reviews?.length > 0 && (
                                                <div className="pt-4 border-t border-white/10">
                                                    <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-3 flex items-center gap-2">
                                                        <MessageSquare className="w-3 h-3" />
                                                        Feedback Received ({ver.reviews.length})
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ver.reviews.slice(0, 3).map((r, i) => (
                                                            <Link
                                                                key={r.id}
                                                                to={`/review-details/${r.id}`}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors text-xs group"
                                                            >
                                                                <Star className="w-3 h-3 text-pink-500 fill-current" />
                                                                <span className="font-bold">{r.ratings}</span>
                                                                <span className="text-white/40">by {r.reviewer?.name || 'Anon'}</span>
                                                                <ArrowRight className="w-3 h-3 text-white/0 group-hover:text-white/40 transition-all -translate-x-1 group-hover:translate-x-0" />
                                                            </Link>
                                                        ))}
                                                        {ver.reviews.length > 3 && (
                                                            <div className="px-3 py-1.5 text-xs text-white/30">
                                                                +{ver.reviews.length - 3} more
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex md:flex-col items-center justify-center gap-6 md:min-w-[120px]">
                                            {/* Score */}
                                            <div className="text-center">
                                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 leading-none mb-1">{avgScore}</div>
                                                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Avg Rizz</div>
                                            </div>

                                            {/* Change Indicator */}
                                            {idx < versions.length - 1 && change !== 0 && (
                                                <div className={`flex flex-col items-center text-sm ${parseFloat(change) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {parseFloat(change) > 0 ? <TrendingUp className="w-5 h-5 mb-1" /> : <TrendingDown className="w-5 h-5 mb-1" />}
                                                    <span className="font-bold">{parseFloat(change) > 0 ? '+' : ''}{change}</span>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => navigate(`/profile/${ver.id}`)}
                                                className="btn-secondary py-2 px-4 text-[11px] font-bold uppercase tracking-wider"
                                            >
                                                Full Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VersionHistory;

