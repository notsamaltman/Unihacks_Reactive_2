import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="pt-24 pb-12"> {/* Padding for fixed navbar */}
            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative overflow-hidden">

                {/* Animated Background Blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[80px]"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto px-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white/80">AI-Powered Dating Profile Review</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text">Dating Profile</span> with Real Feedback
                    </h1>

                    <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                        Stop guessing why you're not getting matches. Get brutally honest, constructive feedback from real people and AI to specific tailored advice.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/submission" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                            Get Your Rizz Score
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="btn-secondary text-lg px-8 py-4">
                            View Sample Report
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Features Preview */}
            <section className="py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Photo Analysis", desc: "Find out which photos are killing your vibe." },
                        { title: "Bio Optimization", desc: "Craft a bio that actually gets replies." },
                        { title: "Red Flag Check", desc: "Spot the accidental red flags in your profile." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 hover:bg-white/15 transition-colors"
                        >
                            <h3 className="text-xl font-bold mb-2 text-pink-300">{feature.title}</h3>
                            <p className="text-white/70">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
