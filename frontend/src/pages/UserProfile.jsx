import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch User Data from Login response (stored or re-fetch if needed)
                // For now, let's assume we store user info in localStorage or fetch from a hypothetical /me endpoint
                // Since /me isn't explicitly in the plan, we'll rely on what we can get or just showing history for now.
                // Actually, let's fetch history first.

                const historyRes = await fetch('http://localhost:8080/api/profile/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    setHistory(historyData);

                    // If we have history, we can assume the user exists. 
                    // We might need a separate /api/user/me if we want to show global user account info independent of profiles.
                    // But for this feature, showing profile versions is key.
                }

            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-white/60">Manage your dating profiles and track your progress.</p>
                    </div>
                    <Link to="/submit" className="btn-primary flex items-center gap-2">
                        Create New Version
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Account Info Card (Placeholder for now) */}
                <div className="glass-card p-8 mb-12 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold">
                        {history[0]?.user?.name?.charAt(0) || <User className="w-10 h-10 text-white" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{history[0]?.user?.name || "Your Account"}</h2>
                        <p className="text-white/60">Versions Created: {history.length}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Version History</h2>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-12 glass-card">
                            <p className="text-white/60 mb-4">No profiles created yet.</p>
                            <Link to="/submit" className="text-primary hover:underline">Create your first profile</Link>
                        </div>
                    ) : (
                        history.map((profile, idx) => (
                            <Link key={profile.id} to={`/profile/${profile.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-6 hover:bg-white/5 transition-all border border-white/10 hover:border-primary/50 group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden">
                                                {profile.photos && profile.photos[0] && (
                                                    <img src={profile.photos[0].url} alt="Profile" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">Version {history.length - idx}.0</h3>
                                                    {idx === 0 && (
                                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-white/40 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(profile.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default UserProfile;
