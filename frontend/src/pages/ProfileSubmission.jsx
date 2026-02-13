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
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('MALE'); // Default to first enum or empty
    const [datingIntent, setDatingIntent] = useState('LONG_TERM');
    const [prompts, setPrompts] = useState([{ question: '', answer: '' }]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('datingIntent', datingIntent);
            formData.append('bio', bio);
            formData.append('prompts', JSON.stringify(prompts));

            files.forEach((file) => {
                formData.append('photos', file);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Optionally store profile ID if needed for next step, though backend handles linking
                navigate('/preferences');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to create profile');
            }
        } catch (error) {
            console.error('Profile submission error:', error);
            alert('An error occurred during submission');
        }
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
                    {/* Name & Age Input Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium ml-1">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="glass-input w-full pl-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="24"
                                className="glass-input w-full text-center"
                            />
                        </div>
                    </div>

                    {/* Gender & Intent Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="glass-input w-full appearance-none"
                            >
                                <option value="MALE" className="bg-gray-900">Male</option>
                                <option value="FEMALE" className="bg-gray-900">Female</option>
                                <option value="NON_BINARY" className="bg-gray-900">Non-Binary</option>
                                <option value="OTHER" className="bg-gray-900">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Looking For</label>
                            <select
                                value={datingIntent}
                                onChange={(e) => setDatingIntent(e.target.value)}
                                className="glass-input w-full appearance-none"
                            >
                                <option value="LONG_TERM" className="bg-gray-900">Long-term Partner</option>
                                <option value="CASUAL" className="bg-gray-900">Casual / Fun</option>
                                <option value="FRIENDSHIP" className="bg-gray-900">New Friends</option>
                                <option value="UNSURE" className="bg-gray-900">Figuring it out</option>
                            </select>
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
                                className="glass-input w-full pl-12 min-h-[100px] resize-none"
                            />
                            <span className="absolute bottom-3 right-4 text-xs text-white/40">
                                {bio.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Prompts Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium ml-1">Profile Prompts</label>
                        {prompts.map((prompt, index) => (
                            <div key={index} className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                                <input
                                    type="text"
                                    placeholder="Prompt Question (e.g., 'A non-negotiable...')"
                                    value={prompt.question}
                                    onChange={(e) => {
                                        const newPrompts = [...prompts];
                                        newPrompts[index].question = e.target.value;
                                        setPrompts(newPrompts);
                                    }}
                                    className="glass-input w-full text-sm mb-2"
                                />
                                <textarea
                                    placeholder="Your Answer..."
                                    value={prompt.answer}
                                    onChange={(e) => {
                                        const newPrompts = [...prompts];
                                        newPrompts[index].answer = e.target.value;
                                        setPrompts(newPrompts);
                                    }}
                                    className="glass-input w-full min-h-[60px] resize-none text-sm"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPrompts([...prompts, { question: '', answer: '' }])}
                            className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                        >
                            + Add another prompt
                        </button>
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
                                        <h2 className="text-2xl font-bold">{name || 'Your Name'} <span className="text-xl font-normal opacity-80">{age || '24'}</span></h2>
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

                                {/* Prompts Preview */}
                                <div className="px-4 pb-4 space-y-3">
                                    {prompts.filter(p => p.question && p.answer).map((prompt, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3">
                                            <p className="text-xs text-white/60 mb-1">{prompt.question}</p>
                                            <p className="text-sm">{prompt.answer}</p>
                                        </div>
                                    ))}
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
