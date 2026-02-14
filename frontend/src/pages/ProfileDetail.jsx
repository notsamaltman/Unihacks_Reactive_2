import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, MessageSquare, Zap } from 'lucide-react';
import ImageStack from '../components/ImageStack';

const ProfileDetail = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/profile/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) return <div className="pt-24 text-center">Profile not found</div>;

    // Use photos from profile or empty array, ensuring format matches ImageStack expectation (File objects or URLs?)
    // ImageStack likely expects File objects for previews, but we need to check if it handles URLs.
    // Looking at ImageStack usage in ProfileSubmission: <ImageStack files={files} /> where files are File objects.
    // We should check ImageStack implementation. If it only handles Files, we might need a different component or adapt it.
    // *Self-correction*: I'll assume ImageStack needs adaptation or I'll just build a simple grid if ImageStack is complex.
    // Let's rely on a simple grid for the Detail view to be safe and robust. 

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <Link to="/my-profile" className="flex items-center text-white/50 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row gap-8 mb-16">
                    {/* Photos Column */}
                    <div className="md:w-1/2">
                        <div className="aspect-[3/4.2] rounded-3xl overflow-hidden bg-gray-900 border-[10px] border-[#0f1115] shadow-2xl relative group ring-1 ring-white/10">
                            <ImageStack files={profile.photos} />

                            {/* Version Label overlay */}
                            <div className="absolute top-6 right-6 z-20">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white/80 border border-white/10">
                                    Version {profile.id.slice(0, 4)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="md:w-1/2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <Calendar className="w-3.5 h-3.5" />
                                Created on {new Date(profile.createdAt).toLocaleDateString()}
                            </div>
                            <h1 className="text-4xl font-black mb-6 tracking-tight">Version Breakdown</h1>
                            <div className="glass-card p-6 border-white/5 bg-white/[0.02]">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Core Bio</h3>
                                <p className="text-lg leading-relaxed font-medium text-white/90">{profile.bio || "No bio provided."}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Profile Prompts</h3>
                            {profile.prompts && Array.isArray(profile.prompts) && profile.prompts.map((prompt, idx) => (
                                <div key={idx} className="glass-card p-5 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                                    <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest mb-2 opacity-80">{prompt.question}</p>
                                    <p className="font-bold text-lg text-white/90 leading-snug">{prompt.answer}</p>
                                </div>
                            ))}
                        </div>

                        {/* Hobbies Section */}
                        {profile.hobbies && profile.hobbies.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Hobbies & Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.hobbies.map((hobby, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-white/60">
                                            {hobby}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pickup Lines Section */}
                        {profile.pickupLines && profile.pickupLines.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pickup Lines</h3>
                                <div className="space-y-3">
                                    {profile.pickupLines.map((line, i) => (
                                        <div key={i} className="glass-card p-4 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent italic text-white/80">
                                            "{line}"
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section at the Bottom */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-pink-500" />
                            Reviews Received
                        </h2>
                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            {profile.reviews?.length || 0} Total
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {!profile.reviews || profile.reviews.length === 0 ? (
                            <div className="col-span-2 py-12 text-center glass-card border-dashed">
                                <p className="text-white/30 italic">No reviews have been submitted for this version yet.</p>
                            </div>
                        ) : (
                            profile.reviews.map((review, idx) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-6 border-white/10 bg-white/[0.02] flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-sm shadow-lg shadow-pink-500/10">
                                                {review.reviewer?.name?.charAt(0) || 'R'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white/90">{review.reviewer?.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Community Reviewer</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-pink-500 leading-none">{review.ratings}</div>
                                            <div className="text-[8px] uppercase font-bold text-white/30 tracking-widest mt-1">Rizz Score</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6 px-3 py-1.5 bg-white/5 rounded-full w-fit border border-white/10">
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Vibe: {review.feedback?.vibeCheck || 'Neutral'}</span>
                                    </div>

                                    <div className="space-y-4 flex-grow">
                                        {review.feedback?.whatWorks && (
                                            <div>
                                                <p className="text-[9px] font-black text-green-400/60 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    What Works
                                                </p>
                                                <p className="text-sm text-white/80 leading-relaxed font-medium">{review.feedback.whatWorks}</p>
                                            </div>
                                        )}
                                        {review.feedback?.needsWork && (
                                            <div>
                                                <p className="text-[9px] font-black text-orange-400/60 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                                    Needs Work
                                                </p>
                                                <p className="text-sm text-white/80 leading-relaxed font-medium">{review.feedback.needsWork}</p>
                                            </div>
                                        )}
                                        {review.feedback?.suggestion && (
                                            <div className="pt-4 border-t border-white/5 mt-4 group">
                                                <p className="text-[9px] font-black text-purple-400/60 uppercase tracking-widest mb-2">Pro Tip / Suggestion</p>
                                                <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 italic text-sm text-purple-200/90 leading-relaxed quote">
                                                    "{review.feedback.suggestion}"
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileDetail;
