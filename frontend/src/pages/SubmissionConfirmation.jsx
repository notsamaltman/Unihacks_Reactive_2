import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const SubmissionConfirmation = () => {
    const [status, setStatus] = useState('processing'); // processing, completed

    useEffect(() => {
        // Simulate processing time
        const timer = setTimeout(() => {
            setStatus('completed');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-lg w-full">
                {status === 'processing' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-t-4 border-l-4 border-r-4 border-primary border-b-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Analyzing your profile...</h2>
                        <p className="text-white/60">Our AI and reviewers are taking a look.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                            <Check className="w-12 h-12 text-white" />
                        </div>

                        <h1 className="text-4xl font-bold mb-4">Submission Received!</h1>
                        <p className="text-lg text-white/70 mb-8">
                            Your profile is now in the queue. You'll receive your Rizz Score and feedback shortly.
                        </p>

                        <Link
                            to="/dashboard"
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SubmissionConfirmation;
