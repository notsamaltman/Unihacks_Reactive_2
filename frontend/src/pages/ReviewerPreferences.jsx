import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Target, ArrowRight, Check } from 'lucide-react';

const ReviewerPreferences = () => {
    const navigate = useNavigate();

    // State for selections
    const [gender, setGender] = useState('female');
    const [intent, setIntent] = useState('relationship');
    const [vibes, setVibes] = useState([]);

    const vibeOptions = [
        "Chill", "Adventurous", "Intellectual", "Party", "Artsy",
        "Fitness", "Foodie", "Gamer", "Professional", "Spiritual"
    ];

    const handleVibeToggle = (vibe) => {
        if (vibes.includes(vibe)) {
            setVibes(vibes.filter(v => v !== vibe));
        } else {
            if (vibes.length < 3) setVibes([...vibes, vibe]);
        }
    };

    return (
        <div className="pt-24 pb-12 max-w-3xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Target Audience</h1>
                <p className="text-white/60">Who do you want to attract? We'll tailor the feedback for you.</p>
            </motion.div>

            <div className="space-y-8">

                {/* Gender Preference */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-pink-300">
                        <Users className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Reviewer Gender</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {['female', 'male', 'everyone'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setGender(opt)}
                                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${gender === opt
                                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <span className="capitalize">{opt}</span>
                                {gender === opt && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Dating Intent */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-purple-300">
                        <Target className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Dating Intent</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'relationship', label: 'Long-term Partner' },
                            { id: 'casual', label: 'Casual / Fun' },
                            { id: 'figuring', label: 'Figuring it out' },
                            { id: 'friends', label: 'New Friends' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setIntent(opt.id)}
                                className={`py-3 px-4 rounded-xl border flex items-center justify-between transition-all ${intent === opt.id
                                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-left">{opt.label}</span>
                                {intent === opt.id && <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Vibe Tags */}
                <section className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-cyan-300">
                        <Heart className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Vibe & Interests (Pick 3)</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {vibeOptions.map((vibe) => (
                            <button
                                key={vibe}
                                onClick={() => handleVibeToggle(vibe)}
                                disabled={!vibes.includes(vibe) && vibes.length >= 3}
                                className={`py-2 px-4 rounded-full border text-sm transition-all ${vibes.includes(vibe)
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {vibe}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => navigate('/submit')}
                        className="btn-secondary flex-1 py-4"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => navigate('/confirmation')}
                        className="btn-primary flex-[2] py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        Submit for Review
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReviewerPreferences;
