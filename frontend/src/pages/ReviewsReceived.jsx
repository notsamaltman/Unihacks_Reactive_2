import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Zap, User, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

const ReviewsReceived = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/reviews/my-reviews', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 max-w-5xl mx-auto px-4">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Reviews Received</h1>
                    <p className="text-white/60">Feedback and scores from the RizzLab community.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                    <div className="text-2xl font-black text-primary leading-none mb-1">{reviews.length}</div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">Total Reviews</div>
                </div>
            </div>

            <div className="grid gap-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 glass-card border-dashed">
                        <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 italic">No reviews received yet. Your profiles are still being critiqued!</p>
                    </div>
                ) : (
                    reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`glass-card p-6 relative overflow-hidden group hover:border-white/20 transition-all ${!review.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
                        >
                            {!review.isRead && (
                                <div className="absolute top-0 right-0 p-4">
                                    <button
                                        onClick={() => markAsRead(review.id)}
                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-pink-400 transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        Mark as Read
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-lg shadow-lg">
                                        {review.reviewer?.name?.charAt(0) || 'R'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-white/90">Review from {review.reviewer?.name}</h3>
                                            {!review.isRead && <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>}
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-medium uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-white/20" />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                            <span className="text-primary font-bold">Version {review.profileVersion?.id?.slice(0, 4)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-pink-500 leading-none">{review.ratings}</div>
                                    <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Rizz Score</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    Vibe: {review.feedback?.vibeCheck || 'Neutral'}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {review.feedback?.whatWorks && (
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-green-400/60 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            What Works
                                        </p>
                                        <p className="text-sm text-white/80 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5">{review.feedback.whatWorks}</p>
                                    </div>
                                )}
                                {review.feedback?.whatDoesntWork && (
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-orange-400/60 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                            Needs Work
                                        </p>
                                        <p className="text-sm text-white/80 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5">{review.feedback.whatDoesntWork}</p>
                                    </div>
                                )}
                            </div>

                            {review.feedback?.suggestions?.[0] && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-[9px] font-black text-purple-400/60 uppercase tracking-widest mb-3">Community Suggestion</p>
                                    <div className="bg-purple-500/5 p-4 rounded-2xl border border-purple-500/10 italic text-sm text-purple-200/90 leading-relaxed">
                                        "{review.feedback.suggestions[0]}"
                                    </div>
                                </div>
                            )}

                            <Link
                                to={`/profile/${review.profileVersionId}`}
                                className="mt-6 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors py-3 border-t border-white/5 group"
                            >
                                View Detailed Version Context
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsReceived;
