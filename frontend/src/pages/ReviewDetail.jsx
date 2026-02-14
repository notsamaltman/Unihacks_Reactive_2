import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Star, Zap, ShieldCheck, AlertTriangle, Lightbulb, Calendar, User } from 'lucide-react';

const ReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const token = localStorage.getItem('token');
                // We'll fetch from my-reviews and find this specific one, 
                // or create a dedicated endpoint. 
                // For now, let's just find it in the my-reviews list.
                const response = await fetch('http://localhost:8080/api/reviews/my-reviews', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const found = data.find(r => r.id === id);
                    if (found) {
                        setReview(found);
                    }
                }
            } catch (error) {
                console.error('Error fetching review details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    if (loading) return (
        <div className="pt-32 text-center text-white/40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p>Loading feedback details...</p>
        </div>
    );

    if (!review) return (
        <div className="pt-32 text-center text-white/40 px-4">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Feedback report not found.</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4 px-6 py-2">Back to Dashboard</button>
        </div>
    );

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Summary Card */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 text-center sticky top-24"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/20">
                            <Star className="w-10 h-10 text-white fill-current" />
                        </div>
                        <div className="mb-6">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                {review.ratings}
                            </div>
                            <div className="text-xs uppercase font-bold text-white/40 tracking-widest mt-2">Overall Rizz Score</div>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4 text-left">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Reviewer</span>
                                <span className="font-bold">{review.reviewer?.name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Date</span>
                                <span className="font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Vibe</span>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 text-xs font-bold">
                                    <Zap className="w-3 h-3" />
                                    {review.feedback?.vibeCheck || 'Neutral'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Detailed Feedback */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-pink-500" />
                                Detailed Analysis
                            </h2>

                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-green-500/20 rounded-lg">
                                            <ShieldCheck className="w-4 h-4 text-green-400" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">What Works</h3>
                                    </div>
                                    <p className="text-white/90 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                                        "{review.feedback?.whatWorks || "The reviewer didn't leave specific notes on what works, but liked the overall vibe."}"
                                    </p>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-red-500/20 rounded-lg">
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">What Needs Work</h3>
                                    </div>
                                    <p className="text-white/90 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                                        "{review.feedback?.whatDoesntWork || "No major red flags identified."}"
                                    </p>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Key Suggestions</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {(review.feedback?.suggestions && review.feedback.suggestions.length > 0) ? (
                                            review.feedback.suggestions.map((s, i) => (
                                                <div key={i} className="flex gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border-l-4 border-yellow-500/50">
                                                    <div className="text-yellow-400 font-bold shrink-0">#{i + 1}</div>
                                                    <p className="text-white/80 text-sm">{s}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-white/40 text-sm italic">No specific suggestions provided.</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>

                    {/* Meta Info: Reviewed Version */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => navigate(`/profile/${review.profileVersionId}`)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white/20" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-white/30 tracking-widest">Feedback for version from</p>
                                <p className="font-medium">{new Date(review.profileVersion?.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-white/20 rotate-180 group-hover:translate-x-1 group-hover:text-pink-500 transition-all" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;
