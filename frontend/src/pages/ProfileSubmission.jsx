import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, AlignLeft, ArrowRight } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ImageStack from '../components/ImageStack';

const predefinedPrompts = [
    "A non-negotiable for me is...",
    "My simple pleasures...",
    "I'm convinced that...",
    "Two truths and a lie...",
    "The way to win me over is...",
    "I spend most of my money on...",
    "Best travel story...",
    "My most controversial opinion is...",
    "I geek out on...",
    "The best spot in town for pizza is...",
    "My golden rule...",
    "I'm looking for...",
    "Together we could...",
    "My zombie apocalypse plan...",
    "If I could have dinner with anyone..."
];

const ProfileSubmission = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [bio, setBio] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('MALE'); // Default to first enum or empty
    const [datingIntent, setDatingIntent] = useState('LONG_TERM');
    const [prompts, setPrompts] = useState([{ question: '', answer: '' }]);
    const [hobbies, setHobbies] = useState([]);
    const [hobbyInput, setHobbyInput] = useState('');
    const [prefs, setPrefs] = useState({
        gender: 'EVERYONE',
        intent: 'LONG_TERM',
        preferredAgeMin: 18,
        preferredAgeMax: 40,
        preferredDescription: '',
        vibes: []
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('datingIntent', datingIntent);
            formData.append('bio', bio);
            formData.append('prompts', JSON.stringify(prompts));
            formData.append('hobbies', JSON.stringify(hobbies));
            formData.append('reviewerPreferences', JSON.stringify({
                gender: prefs.gender,
                intent: prefs.intent,
                preferredAgeMin: prefs.preferredAgeMin,
                preferredAgeMax: prefs.preferredAgeMax,
                preferredDescription: prefs.preferredDescription,
                vibes: prefs.vibes
            }));

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
                localStorage.setItem('profile_step_complete', 'true');
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to create profile');
            }
        } catch (error) {
            console.error('Profile submission error:', error);
            alert('An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    const addHobby = () => {
        if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
            setHobbies([...hobbies, hobbyInput.trim()]);
            setHobbyInput('');
        }
    };

    const removeHobby = (hobby) => {
        setHobbies(hobbies.filter(h => h !== hobby));
    };

    return (
        <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Create Your Profile</h1>
                <p className="text-white/60">Upload your best photos and tell us about yourself.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
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

                    {/* Hobbies Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Hobbies & Interests</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={hobbyInput}
                                onChange={(e) => setHobbyInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                                placeholder="Add a hobby (e.g. Hiking)"
                                className="glass-input flex-grow"
                            />
                            <button
                                type="button"
                                onClick={addHobby}
                                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hobbies.map((hobby, i) => (
                                <span key={i} className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/30 flex items-center gap-2">
                                    {hobby}
                                    <button type="button" onClick={() => removeHobby(hobby)} className="hover:text-white">×</button>
                                </span>
                            ))}
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
                                <select
                                    value={prompt.question}
                                    onChange={(e) => {
                                        const newPrompts = [...prompts];
                                        newPrompts[index].question = e.target.value;
                                        setPrompts(newPrompts);
                                    }}
                                    className="glass-input w-full text-sm mb-2 appearance-none"
                                >
                                    <option value="" disabled className="bg-gray-900 text-white/50">Select a prompt...</option>
                                    {predefinedPrompts.map((p, i) => (
                                        <option key={i} value={p} className="bg-gray-900">{p}</option>
                                    ))}
                                </select>
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

                        <div className="border-[8px] border-black rounded-[3rem] overflow-hidden bg-gray-900 aspect-[9/19] shadow-2xl relative">
                            <div className="absolute top-0 w-full h-8 bg-black/50 z-20 flex justify-between px-6 items-center text-[10px]">
                                <span>9:41</span>
                                <span>5G</span>
                            </div>

                            <div className="h-full overflow-y-auto pb-8 custom-scrollbar">
                                <div className="relative aspect-[3/4] bg-gray-800">
                                    <ImageStack files={files} />
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 pointer-events-none z-20">
                                        <h2 className="text-2xl font-bold">{name || 'Your Name'} <span className="text-xl font-normal opacity-80">{age || '24'}</span></h2>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    {bio ? (
                                        <p className="text-white/90 text-sm leading-relaxed">{bio}</p>
                                    ) : (
                                        <p className="text-white/30 text-sm italic">Your bio will appear here...</p>
                                    )}
                                </div>

                                <div className="px-4 pb-4 space-y-3">
                                    {prompts.filter(p => p.question && p.answer).map((prompt, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3">
                                            <p className="text-xs text-white/60 mb-1">{prompt.question}</p>
                                            <p className="text-sm">{prompt.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-20"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reviewer Preference Section - Centered */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl mx-auto mb-12"
            >
                <div className="p-8 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-3xl border border-white/10 space-y-8 backdrop-blur-md">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Reviewer Preferences</h3>
                        <p className="text-white/60">Help us find the best people to give you feedback</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Preferred Reviewer Gender</label>
                            <select
                                value={prefs.gender}
                                onChange={(e) => setPrefs({ ...prefs, gender: e.target.value })}
                                className="glass-input w-full appearance-none"
                            >
                                <option value="EVERYONE" className="bg-gray-900">Everyone</option>
                                <option value="MALE" className="bg-gray-900">Men</option>
                                <option value="FEMALE" className="bg-gray-900">Women</option>
                                <option value="NON_BINARY" className="bg-gray-900">Non-Binary People</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Target Dating Intent</label>
                            <select
                                value={prefs.intent}
                                onChange={(e) => setPrefs({ ...prefs, intent: e.target.value })}
                                className="glass-input w-full appearance-none"
                            >
                                <option value="LONG_TERM" className="bg-gray-900">Long-term Partner</option>
                                <option value="CASUAL" className="bg-gray-900">Casual / Fun</option>
                                <option value="FRIENDSHIP" className="bg-gray-900">New Friends</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Preferred Age Range</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={prefs.preferredAgeMin}
                                    onChange={(e) => setPrefs({ ...prefs, preferredAgeMin: parseInt(e.target.value) })}
                                    className="glass-input w-full text-center"
                                    placeholder="Min"
                                />
                                <span className="text-white/40">to</span>
                                <input
                                    type="number"
                                    value={prefs.preferredAgeMax}
                                    onChange={(e) => setPrefs({ ...prefs, preferredAgeMax: parseInt(e.target.value) })}
                                    className="glass-input w-full text-center"
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium ml-1">Ideal Match Description</label>
                            <textarea
                                value={prefs.preferredDescription}
                                onChange={(e) => setPrefs({ ...prefs, preferredDescription: e.target.value })}
                                placeholder="Describe the kind of person you want feedback from (e.g. Someone athletic who loves dogs...)"
                                className="glass-input w-full min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-2xl mx-auto relative z-10">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-pink-500/20"
                >
                    {loading ? 'Creating Profile...' : 'Submit New Profile'}
                    {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                </button>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                    <h2 className="text-2xl font-bold animate-pulse">Analyzing your Rizz...</h2>
                    <p className="text-white/60">Uploading photos and generating profile version</p>
                </div>
            )}
        </div>
    );
};

export default ProfileSubmission;
