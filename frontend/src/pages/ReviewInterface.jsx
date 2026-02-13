import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, ArrowLeft, Send } from 'lucide-react';

const ReviewInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rizzRating, setRizzRating] = useState(50);

    const [feedback, setFeedback] = useState({
        vibe: '',
        whatWorks: '',
        needsWork: ''
    });

    // Dummy Profile Data
    const profile = {
        id: id,
        name: 'David',
        age: 25,
        photos: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop"
        ],
        bio: "Just a regular guy looking for someone to share pizza with.",
        prompts: [
            { question: "A non-negotiable...", answer: "You must like dogs." },
            { question: "I guarantee you that...", answer: "I will beat you at Mario Kart." }
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting review:', { ...feedback, rizzRating });
        // Simulate API call
        setTimeout(() => {
            navigate('/reviewer-dashboard');
        }, 1000);
    };

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
                {/* Profile View */}
                <div className="space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="grid grid-cols-2 gap-1">
                            {profile.photos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={photo}
                                    alt={`Profile ${idx + 1}`}
                                    className="w-full aspect-[3/4] object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                />
                            ))}
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2">{profile.name}, {profile.age}</h2>
                            <p className="text-white/80 mb-6">{profile.bio}</p>

                            <div className="space-y-4">
                                {profile.prompts.map((prompt, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-xs text-pink-400 font-bold uppercase mb-1">{prompt.question}</p>
                                        <p className="text-white/90">{prompt.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                                    onChange={(e) => setRizzRating(e.target.value)}
                                    className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-white/40 mt-1">
                                    <span>Yikes 😬</span>
                                    <span>Rizz God 🔥</span>
                                </div>
                            </div>

                            {/* Vibe Check */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">Vibe Check</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Wholesome', 'Funny', 'Intense', 'Casual'].map((opt) => (
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
                                    placeholder="e.g., Great smile in the second photo..."
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
                                    placeholder="e.g., Bio is a bit too generic..."
                                    value={feedback.needsWork}
                                    onChange={(e) => setFeedback({ ...feedback, needsWork: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                            >
                                Submit Review
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
