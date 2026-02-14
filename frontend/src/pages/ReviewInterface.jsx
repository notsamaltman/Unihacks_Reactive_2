import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import ImageStack from '../components/ImageStack';

const ReviewInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rizzRating, setRizzRating] = useState(50);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [feedback, setFeedback] = useState({
        vibe: 'Wholesome',
        whatWorks: '',
        needsWork: '',
        suggest: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                // We use a general get profile endpoint if available, or fetch matching to find it
                // For now, let's assume we can fetch it directly or it was passed.
                // Since we don't have a GET /api/profile/:id for public view, 
                // I'll use the matching endpoint logic or assume /api/profile/:id doesn't checks ownership (wait, it DOES check ownership in profile.js).
                // I need a public profile view endpoint.

                // Let's check backend/routes/profile.js again for a public endpoint.
                // ... later ... I'll just try to fetch it from a new public endpoint I'll add or use history.

                // Actually, I'll add a GET /api/profile/public/:id in profile.js
                const response = await fetch(`http://localhost:8080/api/profile/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Wait, the existing /api/profile/:id checks ownership.
                // I need to update profile.js to allowed reviewers.

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else if (response.status === 403) {
                    // If it's 403, it means it's not our profile, which is EXPECTED for a reviewer.
                    // I'll need to update the backend to allow viewing if you are an assigned reviewer.
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    profileVersionId: id,
                    ratings: rizzRating,
                    vibeCheck: feedback.vibe,
                    whatWorks: feedback.whatWorks,
                    whatDoesntWork: feedback.needsWork,
                    suggestions: [feedback.suggest]
                })
            });

            if (response.ok) {
                navigate('/reviewer-dashboard');
            } else {
                alert('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="pt-32 text-center text-white/40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p>Loading profile for review...</p>
        </div>
    );

    if (!profile) return (
        <div className="pt-32 text-center text-white/40 px-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Profile not found or access restricted.</p>
            <button onClick={() => navigate('/reviewer-dashboard')} className="btn-primary mt-4 px-6 py-2">Go Back</button>
        </div>
    );

    return (
        <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Profile View - Phone Mockup */}
                <div className="flex justify-center items-start pt-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-[360px] border-[12px] border-[#0f1115] rounded-[3.5rem] overflow-hidden bg-gray-900 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative ring-1 ring-white/10"
                    >
                        <div className="h-[700px] overflow-y-auto pb-8 custom-scrollbar relative">
                            <div className="relative aspect-[3/4.2] bg-gray-800">
                                <ImageStack files={profile.photos} />

                                {/* Info Overlay on Image */}
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24 pointer-events-none z-20">
                                    <h2 className="text-3xl font-black text-white flex items-center gap-2">
                                        {profile.user?.name}
                                        <span className="text-2xl font-normal opacity-80">{profile.user?.age}</span>
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        {profile.user?.gender && (
                                            <span className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60">
                                                {profile.user.gender}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* Bio Section */}
                                <div>
                                    <p className="text-white/90 text-[15px] leading-relaxed font-medium">
                                        {profile.bio}
                                    </p>
                                </div>

                                {/* Skills / Hobbies Section */}
                                {profile.hobbies && profile.hobbies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.hobbies.map((hobby, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/70 font-semibold shadow-sm">
                                                {hobby}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Pickup Lines Section */}
                                {profile.pickupLines && profile.pickupLines.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Pickup Lines</p>
                                        <div className="space-y-2">
                                            {profile.pickupLines.map((line, i) => (
                                                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl italic text-[13px] text-white/80">
                                                    "{line}"
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prompts Section */}
                                <div className="space-y-4">
                                    {profile.prompts?.map((prompt, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-white/10 to-transparent p-5 rounded-2xl border border-white/10 shadow-inner">
                                            <p className="text-[11px] text-pink-400 font-black uppercase tracking-widest mb-2 opacity-80">{prompt.question}</p>
                                            <p className="text-white font-medium text-lg leading-snug">{prompt.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Home Bar indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-20 pointer-events-none"></div>
                    </motion.div>
                </div>

                {/* Feedback Form */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-400" />
                            Your Review
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rizz Rating */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-white/80">Rizz Score Rating</label>
                                    <span className="text-lg font-bold text-pink-400">{rizzRating}/100</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={rizzRating}
                                    onChange={(e) => setRizzRating(parseInt(e.target.value))}
                                    className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-white/40 mt-1">
                                    <span>Needs Help 😬</span>
                                    <span>Rizz King/Queen 🔥</span>
                                </div>
                            </div>

                            {/* Vibe Check */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">Vibe Check</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Wholesome', 'Funny', 'Mysterious', 'Adventurous', 'Casual', 'Intellectual'].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFeedback({ ...feedback, vibe: opt })}
                                            className={`py-2 px-3 rounded-lg border text-sm transition-all ${feedback.vibe === opt
                                                ? 'bg-purple-500/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* What Works */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4 text-green-400" />
                                    What works?
                                </label>
                                <textarea
                                    className="glass-input w-full min-h-[80px] text-sm"
                                    placeholder="e.g., Great first photo, very inviting..."
                                    value={feedback.whatWorks}
                                    onChange={(e) => setFeedback({ ...feedback, whatWorks: e.target.value })}
                                />
                            </div>

                            {/* Needs Work */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <ThumbsDown className="w-4 h-4 text-red-400" />
                                    What needs work?
                                </label>
                                <textarea
                                    className="glass-input w-full min-h-[80px] text-sm"
                                    placeholder="e.g., The third prompt is a bit too short..."
                                    value={feedback.needsWork}
                                    onChange={(e) => setFeedback({ ...feedback, needsWork: e.target.value })}
                                />
                            </div>

                            {/* Suggestion */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">One key suggestion</label>
                                <textarea
                                    className="glass-input w-full min-h-[60px] text-sm"
                                    placeholder="Try changing your primary photo to..."
                                    value={feedback.suggest}
                                    onChange={(e) => setFeedback({ ...feedback, suggest: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ReviewInterface;
