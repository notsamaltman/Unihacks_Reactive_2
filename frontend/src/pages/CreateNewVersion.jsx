import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Copy } from 'lucide-react';
import FileUpload from '../components/FileUpload';

const CreateNewVersion = () => {
    const navigate = useNavigate();
    // Pre-filled data simulation
    const [bio, setBio] = useState('Unpopular opinion: pineapple belongs on pizza. 🍕\n\nLooking for someone to go on hiking adventures with and maybe steal my hoodies. Professional napper and part-time coffee connoisseur.');
    const [files, setFiles] = useState([]);
    const [prompts, setPrompts] = useState([
        { question: 'A non-negotiable...', answer: 'You must like dogs.' },
        { question: 'I guarantee you that...', answer: 'I will beat you at Mario Kart.' }
    ]);

    const handleSave = () => {
        // Simulate save
        navigate('/submission'); // In real app, this would go to confirmation or back to dashboard
    };

    return (
        <div className="pt-24 pb-12 max-w-5xl mx-auto px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Create New Version</h1>
                <button className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                    <Copy className="w-4 h-4" /> Duplicate Current
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">

                <div className="space-y-8">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold mb-4">Update Photos</h2>
                        <p className="text-white/60 text-sm mb-4">
                            Try replacing your lowest rated photos first. Reviewers suggested better lighting for your main photo.
                        </p>
                        <FileUpload files={files} setFiles={setFiles} />
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold mb-4">Refine Bio</h2>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="glass-input w-full min-h-[200px] resize-none"
                            placeholder="Write your bio..."
                        />
                        <div className="flex justify-between mt-2 text-xs text-white/40">
                            <span>Try to include one specific hobby or interest.</span>
                            <span>{bio.length}/500</span>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold mb-4">Edit Prompts</h2>
                        <div className="space-y-4">
                            {prompts.map((prompt, index) => (
                                <div key={index} className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <input
                                        type="text"
                                        placeholder="Prompt Question"
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
                                onClick={() => setPrompts([...prompts, { question: '', answer: '' }])}
                                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                + Add another prompt
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6 bg-primary/10 border-primary/20">
                        <h2 className="text-lg font-bold text-primary mb-4">AI Suggestions</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                                <span className="text-white/80">
                                    Your bio mentions "hiking". Consider adding a photo of you on a trail to back it up.
                                </span>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                                <span className="text-white/80">
                                    Your sentiment analysis shows a "humorous" tone. Keep it up, but add one sincere prompt answer.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleSave}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save New Version
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateNewVersion;
