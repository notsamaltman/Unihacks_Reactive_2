import { motion } from 'framer-motion';
import { Star, MessageSquare, TrendingUp, User, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewerDashboard = () => {
    // Dummy Data
    const stats = [
        { label: 'Profiles Reviewed', value: '12', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Karma Points', value: '450', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Helpful Votes', value: '8', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    const queue = [
        { id: 1, name: 'David', age: 25, type: 'Casual', img: null },
        { id: 2, name: 'Sarah', age: 23, type: 'Long-term', img: null },
        { id: 3, name: 'James', age: 28, type: 'Friends', img: null },
    ];

    return (
        <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Reviewer Dashboard</h1>
                    <p className="text-white/60">Help others optimize their profiles and earn karma.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-200">Level 3 Reviewer</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                Profiles for You
            </h2>

            {/* Profile Queue */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queue.map((profile, idx) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className="glass-card overflow-hidden group hover:border-pink-500/30 transition-all"
                    >
                        <div className="aspect-[4/3] bg-gray-800 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="font-bold text-lg">{profile.name}, {profile.age}</h3>
                                <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                                    Looking for: {profile.type}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-white/60 mb-4">
                                Needs help with: Photos & Bio
                            </p>
                            <Link to={`/review/${profile.id}`} className="btn-primary w-full py-2 flex items-center justify-center gap-2 group-hover:bg-pink-600 transition-colors">
                                Start Review
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div >
    );
};

export default ReviewerDashboard;
