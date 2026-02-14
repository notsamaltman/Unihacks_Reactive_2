import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare, Zap, User, Calendar } from 'lucide-react';

const MyReviewsGiven = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/reviews/given', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Error fetching given reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Reviews I've Given</h1>
                    <p className="text-white/60">Your history of helping others optimize their profiles.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                    <div className="text-2xl font-black text-pink-500 leading-none mb-1">{reviews.length}</div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">Profiles Reviewed</div>
                </div>
            </div>

            <div className="grid gap-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 glass-card border-dashed">
                        <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 italic">You haven't given any reviews yet. Start reviewing from the dashboard!</p>
                        <Link to="/reviewer-dashboard" className="btn-primary mt-6 px-8 py-3 inline-block">
                            Start Reviewing
                        </Link>
                    </div>
                ) : (
                    reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card overflow-hidden group hover:border-white/20 transition-all"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Profile Preview Thumbnail */}
                                <div className="md:w-48 h-48 md:h-auto relative bg-gray-800 shrink-0">
                                    {review.profileVersion?.photos?.[0] ? (
                                        <img
                                            src={review.profileVersion.photos[0].url}
                                            alt="Profile"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <p className="font-bold text-white text-sm">
                                            {review.profileVersion?.user?.name}, {review.profileVersion?.user?.age}
                                        </p>
                                    </div>
                                </div>

                                {/* Review Details */}
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-lg text-white/90">Review for {review.profileVersion?.user?.name}</h3>
                                                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    {review.feedback?.vibeCheck || 'Review'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-white/40">
                                                <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-pink-500 leading-none">{review.ratings}</div>
                                            <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Score Given</div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        {review.feedback?.whatWorks && (
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                <p className="text-[9px] font-black text-green-400/60 uppercase tracking-widest mb-1">What You Liked</p>
                                                <p className="text-xs text-white/70 line-clamp-2">{review.feedback.whatWorks}</p>
                                            </div>
                                        )}
                                        {review.feedback?.whatDoesntWork && (
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                <p className="text-[9px] font-black text-orange-400/60 uppercase tracking-widest mb-1">Areas for Improvement</p>
                                                <p className="text-xs text-white/70 line-clamp-2">{review.feedback.whatDoesntWork}</p>
                                            </div>
                                        )}
                                    </div>

                                    {review.feedback?.suggestions?.[0] && (
                                        <div className="italic text-xs text-purple-300/80 bg-purple-500/5 p-3 rounded-xl border border-purple-500/10">
                                            "Pro Tip: {review.feedback.suggestions[0]}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyReviewsGiven;
