import { motion } from 'framer-motion';
import {
    TrendingUp, AlertTriangle, Lightbulb, CheckCircle,
    Share2, RotateCcw, ThumbsUp, ThumbsDown, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeedbackDashboard = () => {
    // Dummy data
    const score = 72;
    const feedbackItems = [
        {
            type: 'photo',
            title: "Main Photo Lighting",
            content: "Your first photo is a bit dark. Try a picture with natural lighting to look more approachable.",
            impact: "High",
            sentiment: "negative"
        },
        {
            type: 'bio',
            title: "Great Hook",
            content: "Starting with 'Unpopular opinion: pineapple belongs on pizza' is a great conversation starter!",
            impact: "Medium",
            sentiment: "positive"
        },
        {
            type: 'redflag',
            title: "Bio Length",
            content: "Your bio is a bit too short. Add one more sentence about your hobbies to give matches more to work with.",
            impact: "Medium",
            sentiment: "neutral"
        }
    ];

    const currentProfile = {
        name: "Alex",
        age: 24,
        bio: "Unpopular opinion: pineapples belong on pizza 🍕",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop"
    };

    return (
        <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
            {/* Header with Comparisons */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Feedback Dashboard</h1>
                    <p className="text-white/60">Version 1.0 • Submitted on Oct 24, 2023</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/history" className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> History
                    </Link>
                    <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Score Column */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>

                        <h2 className="text-xl font-medium text-white/80 mb-6">Rizz Score</h2>

                        <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                            {/* Circular Progress Background */}
                            <svg className="w-full h-full rotate-[-90deg]">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                                <motion.circle
                                    cx="96" cy="96" r="88"
                                    stroke="currentColor" strokeWidth="12" fill="transparent"
                                    className="text-primary drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - score / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold">{score}</span>
                                <span className="text-sm text-white/50">/ 100</span>
                            </div>
                        </div>

                        <p className="text-lg">
                            {score >= 80 ? "Certified Rizz God 🔥" : score >= 60 ? "Solid Potential 👍" : "Needs Work 🚧"}
                        </p>
                    </motion.div>

                    {/* Profile Preview */}
                    <div className="glass-card overflow-hidden">
                        <div className="aspect-[4/3] relative">
                            <img
                                src={currentProfile.photo}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                                    <p className="text-white/80 line-clamp-2 text-sm mt-1">{currentProfile.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-pink-400" />
                            Performance
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Photo Quality', value: 85, color: 'bg-green-500' },
                                { label: 'Bio Creativity', value: 65, color: 'bg-yellow-500' },
                                { label: 'Prompt Engagement', value: 45, color: 'bg-red-500' }
                            ].map((stat, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-white/70">{stat.label}</span>
                                        <span>{stat.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                                            className={`h-full ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        Key Insights
                    </h2>

                    {feedbackItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 border-l-4 border-l-primary hover:bg-white/5 transition-colors"
                            style={{
                                borderLeftColor: item.sentiment === 'positive' ? '#4ade80' : item.sentiment === 'negative' ? '#f87171' : '#fbbf24'
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 uppercase tracking-wider">{item.type}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.impact === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {item.impact} Impact
                                </span>
                            </div>
                            <p className="text-white/80 leading-relaxed mb-4">{item.content}</p>

                            <div className="flex gap-2">
                                <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                    <ThumbsUp className="w-3 h-3" /> Helpful
                                </button>
                                <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                    <ThumbsDown className="w-3 h-3" /> Not Useful
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Actionable Steps */}
                    <div className="glass-card p-6 bg-gradient-to-br from-purple-900/40 to-transparent">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Action Plan
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Replace your first photo with a clear headshot",
                                "Expand your bio to include 1-2 specific interests",
                                "Remove the sunglasses photo (hides your face)"
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/20">
                                        {i + 1}
                                    </div>
                                    <span className="text-white/90">{step}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <Link to="/new-version" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                                Create Improved Version
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDashboard;
