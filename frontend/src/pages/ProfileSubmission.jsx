import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, AlignLeft, ArrowRight } from 'lucide-react';
import FileUpload from '../components/FileUpload';

const ProfileSubmission = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [bio, setBio] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate navigation to next step
        navigate('/preferences');
    };

    return (
        <div className="pt-24 pb-12 max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Create Your Profile</h1>
                <p className="text-white/60">Upload your best photos and tell us about yourself.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="How should we call you?"
                                className="glass-input w-full pl-12"
                            />
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Profile Photos (Max 6)</label>
                        <FileUpload files={files} setFiles={setFiles} />
                    </div>

                    {/* Bio Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Your Bio</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Paste your dating app bio here..."
                                maxLength={500}
                                className="glass-input w-full pl-12 min-h-[150px] resize-none"
                            />
                            <span className="absolute bottom-3 right-4 text-xs text-white/40">
                                {bio.length}/500
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        Next: Reviewer Preferences
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Live Preview Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="hidden lg:block sticky top-24 h-fit"
                >
                    <div className="glass-card p-6 border-white/10 bg-black/40">
                        <h3 className="text-lg font-bold mb-4 text-center">Live Preview</h3>

                        {/* Phone Mockup Frame */}
                        <div className="border-[8px] border-black rounded-[3rem] overflow-hidden bg-gray-900 aspect-[9/19] shadow-2xl relative">
                            {/* Status Bar */}
                            <div className="absolute top-0 w-full h-8 bg-black/50 z-20 flex justify-between px-6 items-center text-[10px]">
                                <span>9:41</span>
                                <span>5G</span>
                            </div>

                            <div className="h-full overflow-y-auto pb-8 custom-scrollbar">
                                {/* Main Photo */}
                                <div className="relative aspect-[3/4] bg-gray-800">
                                    {files[0] ? (
                                        <img src={URL.createObjectURL(files[0])} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            Top Photo
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                        <h2 className="text-2xl font-bold">{name || 'Your Name'} <span className="text-xl font-normal opacity-80">24</span></h2>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="p-4 space-y-4">
                                    {bio ? (
                                        <p className="text-white/90 text-sm leading-relaxed">{bio}</p>
                                    ) : (
                                        <p className="text-white/30 text-sm italic">Your bio will appear here...</p>
                                    )}
                                </div>

                                {/* Other Photos */}
                                <div className="px-4 pb-4 space-y-4">
                                    {files.slice(1).map((file, i) => (
                                        <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-20"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileSubmission;
