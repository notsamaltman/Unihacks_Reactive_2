import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, AlertTriangle, CheckCircle, Zap, TrendingUp, User, Layout, MessageSquare, ArrowRight, X } from 'lucide-react';

const ChadRizzScore = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChadAnalysis = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/ai/chad', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to get insights from Chad.');
                }
            } catch (err) {
                console.error('Error fetching Chad analysis:', err);
                setError('Chad is currently out of range. Check your connection!');
            } finally {
                setLoading(false);
            }
        };

        fetchChadAnalysis();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#0f1115] relative overflow-hidden">
                {/* Dashboard style background elements */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

                <div className="relative w-24 h-24 mb-8 z-10">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight z-10">Chad is Analyzing Your Game...</h2>
                <p className="text-white/40 italic font-medium z-10">"Hold on, bro. Real alpha energy takes a second to process."</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4 bg-[#0f1115] relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>
                <div className="glass-card p-12 text-center max-w-md border-red-500/20 relative z-10">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">{error}</h2>
                    <p className="text-white/60 mb-8 italic">"Even Chad hits a wall sometimes. Check if you set your Gemini API key!"</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-3 w-full">
                        Back to Dashboard
                    </button>
                    {error.includes('API Key') && (
                        <p className="mt-4 text-[10px] text-white/20 uppercase font-black tracking-widest">
                            Admin Note: Configure GEMINI_API_KEY in .env
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const { profile, analysis } = data;

    return (
        <div className="min-h-screen bg-[#0f1115] relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 w-full relative z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Profile and Community Reviews */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        {/* Profile Preview Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card overflow-hidden group shadow-2xl"
                        >
                            <div className="aspect-[4/5] relative bg-gray-900">
                                {profile.photos?.[0] ? (
                                    <img src={profile.photos[0].url} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User className="w-16 h-16 text-white/10" /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/20 to-transparent flex flex-col justify-end p-8">
                                    <p className="text-white/70 mt-2 line-clamp-3 font-medium">{profile.bio}</p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {profile.hobbies?.slice(0, 3).map((hobby, i) => (
                                            <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/10 px-2 py-1 rounded">
                                                {hobby}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Community Feedbacks */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Community context
                            </h3>
                            <div className="space-y-4">
                                {profile.reviews?.slice(0, 3).map((review, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-white/60">{review.reviewer?.name || 'Anonymous'}</span>
                                            <span className="text-xs font-black text-primary italic">{review.ratings}</span>
                                        </div>
                                        <p className="text-xs text-white/40 italic line-clamp-2">"{review.feedback?.whatWorks}"</p>
                                    </div>
                                ))}
                                <button
                                    onClick={() => navigate('/reviews-received')}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors border-t border-white/5 mt-2"
                                >
                                    View All {profile.reviews?.length || 0} Reviews
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Chad's Analysis */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                        {/* Score and Chad Quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-1 p-0 overflow-hidden relative"
                        >
                            <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-purple-600/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                                {/* Circular Score */}
                                <div className="relative w-48 h-48 shrink-0">
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                        <motion.circle
                                            cx="96" cy="96" r="88"
                                            stroke="currentColor" strokeWidth="12" fill="transparent"
                                            className="text-primary"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - analysis.score / 100)}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - analysis.score / 100) }}
                                            transition={{ duration: 2.5, ease: "circOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 }}
                                            className="text-6xl font-black italic tracking-tighter text-white drop-shadow-lg"
                                        >
                                            {analysis.score}
                                        </motion.span>
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1 italic">Chad Score</span>
                                    </div>
                                </div>

                                <div className="space-y-6 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">
                                            {analysis.score >= 90 ? "Certified Alpha" : analysis.score >= 70 ? "High Tier Rizz" : "Potential Unlocked"}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black italic leading-tight text-white">
                                        "{analysis.chadQuote}"
                                    </h2>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="w-12 h-0.5 bg-white/10"></div>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/40 italic">Chad AI Wingman</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tactical Analysis Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card p-8 md:col-span-2 shadow-xl"
                            >
                                <h3 className="text-xl font-black mb-6 flex items-center gap-3 italic">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                    Chad's Executive Summary
                                </h3>
                                <p className="text-white/80 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                    {analysis.analysis}
                                </p>
                            </motion.div>

                            {/* Red Flags and Action Plan */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h3 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Instant Red Flags
                                </h3>
                                <div className="space-y-3">
                                    {analysis.redFlags.length > 0 ? (
                                        analysis.redFlags.map((flag, i) => (
                                            <div key={i} className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-red-500/10 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                    <XIcon className="w-3.5 h-3.5 text-red-500" />
                                                </div>
                                                <p className="text-white/80 text-sm font-bold italic leading-snug">{flag}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex items-center gap-4 italic opacity-60">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            <p className="text-sm">Clean as a whistle, king.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <h3 className="text-sm font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Actionable Battle Plan
                                </h3>
                                <div className="space-y-3">
                                    {analysis.actionPlan.map((step, i) => (
                                        <div key={i} className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-green-500/10 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px] text-green-400">
                                                {i + 1}
                                            </div>
                                            <p className="text-white/80 text-sm font-bold italic leading-snug">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal X icon component to avoid parsing issues
const XIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

export default ChadRizzScore;
