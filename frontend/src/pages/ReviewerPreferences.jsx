import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Target, ArrowRight, Check } from 'lucide-react';

const ReviewerPreferences = () => {
    const navigate = useNavigate();

    // State for selections
    const [gender, setGender] = useState('FEMALE');
    const [intent, setIntent] = useState('LONG_TERM');
    const [vibes, setVibes] = useState([]);

    useEffect(() => {
        // Enforce flow: Must complete profile submission first
        const stepComplete = localStorage.getItem('profile_step_complete');
        if (!stepComplete) {
            navigate('/submit');
        }
    }, [navigate]);

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

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gender,
                    intent,
                    vibes
                })
            });

            if (response.ok) {
                // Clear flow flag so user can't navigate back to preferences without submitting profile again
                localStorage.removeItem('profile_step_complete');
                navigate('/confirmation');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save preferences');
            }
        } catch (error) {
            console.error('Preferences submission error:', error);
            alert('An error occurred');
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
                {/* ... existing sections ... */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={() => navigate('/submit')}
                    className="btn-secondary flex-1 py-4"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn-primary flex-[2] py-4 text-lg flex items-center justify-center gap-2 group"
                >
                    Submit for Review
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ReviewerPreferences;
