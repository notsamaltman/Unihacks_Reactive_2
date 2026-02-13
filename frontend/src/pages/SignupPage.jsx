import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, User, Mail, Lock, ArrowRight } from 'lucide-react';

const SignupPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState('submitter');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const roleParam = params.get('role');
        if (roleParam) {
            setRole(roleParam);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    datingIntent: role === 'reviewer' ? 'UNSURE' : 'CASUAL', // Default or handle in UI
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // Store user info if needed
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsSignedUp(true);
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        if (role === 'submitter') {
            navigate('/submission');
        } else {
            navigate('/preferences');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[80px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-card relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-lg shadow-pink-500/20">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                        {isSignedUp ? 'Welcome aboard!' : 'Create Account'}
                    </h2>
                    <p className="text-white/60 mt-2">
                        {isSignedUp
                            ? 'Your account has been created successfully.'
                            : `Sign up to ${role === 'submitter' ? 'get your Rizz Score' : 'start reviewing profiles'}`
                        }
                    </p>
                </div>

                {!isSignedUp ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                        >
                            {isLoading && (
                                <div className="absolute bottom-0 left-0 h-1 bg-white/50 animate-loading-bar w-full"></div>
                            )}
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center">
                            Account created successfully!
                        </div>
                        <button
                            onClick={handleContinue}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                        >
                            {role === 'submitter' ? 'Create Profile' : 'Go to Reviewer Preferences'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {!isSignedUp && (
                    <p className="text-center text-white/40 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                            Log in
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default SignupPage;
