import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar } from 'lucide-react';
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
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Photos Column */}
                    <div className="md:w-1/2 space-y-4">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 relative shadow-2xl">
                            {profile.photos && profile.photos.length > 0 ? (
                                <img src={profile.photos[0].url} alt="Main Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">No Photo</div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {profile.photos && profile.photos.slice(1).map((photo, i) => (
                                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                                    <img src={photo.url} alt={`Profile ${i + 2}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="md:w-1/2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                                <Calendar className="w-4 h-4" />
                                Created on {new Date(profile.createdAt).toLocaleDateString()}
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Profile Details</h1>
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Bio</h3>
                                <p className="text-lg leading-relaxed">{profile.bio || "No bio provided."}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Prompts</h3>
                            {profile.prompts && Array.isArray(profile.prompts) && profile.prompts.map((prompt, idx) => (
                                <div key={idx} className="glass-card p-4 border-l-4 border-primary">
                                    <p className="text-sm text-white/60 mb-1">{prompt.question}</p>
                                    <p className="font-medium text-lg">{prompt.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileDetail;
