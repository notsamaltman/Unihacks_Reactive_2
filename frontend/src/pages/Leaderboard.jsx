import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Crown, Star, Flame, User, ArrowRight, Zap, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [rizzlers, setRizzlers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/leaderboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRizzlers(data);
                } else {
                    setError('The elite group is currently private. Try again later!');
                }
            } catch (err) {
                console.error('Leaderboard fetch error:', err);
                setError('Failed to connect to the Rizz Network.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#0f1115]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Trophy className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="mt-6 text-white/40 font-black tracking-widest uppercase text-xs">Summoning the Elites...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] relative overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="pt-24 max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Global Rankings</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
                        RIZZLERS <span className="text-primary italic">OF THE</span> WEEK
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl mx-auto font-medium">
                        The top 5 profiles setting the standard for <span style={{ fontFamily: "'Poppins', sans-serif" }} className="font-bold">RizzLab</span>. Calculated by community consensus.
                    </p>
                </motion.div>

                {error ? (
                    <div className="glass-card p-12 text-center border-red-500/20">
                        <p className="text-white/60 mb-6">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3">Try Again</button>
                    </div>
                ) : rizzlers.length === 0 ? (
                    <div className="glass-card p-20 text-center border-white/5">
                        <Zap className="w-12 h-12 text-white/10 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-white/40">The leaderboard is wide open.</h3>
                        <p className="text-white/20 mt-2">Submit your profile and get reviewed to claim your spot!</p>
                        <button onClick={() => navigate('/dashboard')} className="mt-8 btn-secondary px-8 py-3">Back to Dashboard</button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {rizzlers.map((rizzler, index) => (
                            <motion.div
                                key={rizzler.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className={`group relative glass-card p-1 overflow-hidden cursor-pointer ${index === 0 ? 'border-primary/40 shadow-[0_0_40px_rgba(236,72,153,0.15)]' : 'border-white/5'
                                    }`}
                                onClick={() => navigate(`/profile/${rizzler.id}`)}
                            >
                                <div className="flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-black/40 rounded-[2rem]">
                                    {/* Rank Display */}
                                    <div className="flex flex-col items-center justify-center w-12 md:w-16 shrink-0">
                                        {index === 0 ? (
                                            <Crown className="w-8 h-8 text-yellow-500 mb-1" />
                                        ) : index === 1 ? (
                                            <Star className="w-7 h-7 text-gray-300 mb-1" />
                                        ) : index === 2 ? (
                                            <Star className="w-7 h-7 text-amber-600/80 mb-1" />
                                        ) : (
                                            <span className="text-2xl font-black text-white/20 mb-1">#{index + 1}</span>
                                        )}
                                        <div className="h-0.5 w-4 bg-white/10"></div>
                                    </div>

                                    {/* Profile Image */}
                                    <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0">
                                        <div className={`absolute inset-0 rounded-2xl overflow-hidden ${index === 0 ? 'ring-2 ring-primary ring-offset-4 ring-offset-[#0f1115]' : 'ring-1 ring-white/10'
                                            }`}>
                                            {rizzler.photo ? (
                                                <img src={rizzler.photo} alt={rizzler.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-white/10" />
                                                </div>
                                            )}
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute -top-2 -right-2 bg-primary p-1.5 rounded-lg shadow-lg">
                                                <Flame className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-end gap-3 mb-1">
                                            <h3 className={`text-xl md:text-2xl font-black italic tracking-tight truncate ${index === 0 ? 'text-white' : 'text-white/90'
                                                }`}>
                                                {rizzler.name}
                                            </h3>
                                            {rizzler.age && (
                                                <span className="text-white/30 text-xs font-bold mb-1.5 shrink-0">{rizzler.age}y</span>
                                            )}
                                        </div>
                                        <p className="text-white/40 text-xs md:text-sm line-clamp-1 italic font-medium">
                                            {rizzler.bio || "No bio needed for this legend."}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {rizzler.hobbies?.slice(0, 3).map((hobby, i) => (
                                                <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-0.5 rounded text-white/40">
                                                    {hobby}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Score Display */}
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-1 italic">Score</div>
                                        <div className={`text-3xl md:text-5xl font-black italic tracking-tighter ${index === 0 ? 'text-white' : 'text-white/90'
                                            }`}>
                                            {rizzler.avgScore}
                                        </div>
                                        <div className="text-[10px] font-bold text-white/20 mt-1 uppercase">
                                            {rizzler.reviewCount} Reviews
                                        </div>
                                    </div>

                                    <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:right-8">
                                        <ArrowRight className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]"
                    >
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;
