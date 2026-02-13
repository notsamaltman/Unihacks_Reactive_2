import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const LandingPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                // Short delay to ensure rendering
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

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

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text">Dating Profile</span> with Real Feedback
                    </h1>

                    <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                        Stop guessing why you're not getting matches. Get brutally honest, constructive feedback from real people and AI to specific tailored advice.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup?role=submitter" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                            Level up your Rizz!
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Preview */}
            <section id="features" className="py-20">
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

            {/* How it Works Section */}
            <section id="how-it-works" className="py-20 bg-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-white/60">Get better matches in 3 simple steps.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { step: "01", title: "Upload Profile", desc: "Share your current dating profile screenshots." },
                            { step: "02", title: "Get Reviewed", desc: "Receive honest feedback from real people." },
                            { step: "03", title: "Improve & Match", desc: "Apply changes and watch your matches skyrocket." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-pink-500/20">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-white/60 max-w-xs mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
                        <p className="text-white/60">Real results from real users.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Alex, 24", text: "I went from 0 matches to 5 in a week just by changing my bio!", rating: 5 },
                            { name: "Sarah, 22", text: "The honest feedback on my photos was a game changer.", rating: 5 },
                            { name: "Mike, 27", text: "Finally understood why I was getting ghosted. Thanks RizzLab!", rating: 4 }
                        ].map((user, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-6 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(user.rating)].map((_, i) => (
                                        <Sparkles key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-white/80 mb-6 italic">"{user.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600"></div>
                                    <span className="font-bold text-sm">{user.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
