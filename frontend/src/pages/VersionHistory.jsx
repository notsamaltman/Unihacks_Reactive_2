import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const VersionHistory = () => {
    // Dummy data
    const versions = [
        {
            id: 1,
            date: 'Oct 24, 2023',
            score: 72,
            change: 0,
            photos: 6,
            bio_length: 240,
            status: 'Current'
        },
        {
            id: 2,
            date: 'Sep 15, 2023',
            score: 65,
            change: 7,
            photos: 5,
            bio_length: 180,
            status: 'Previous'
        },
        {
            id: 3,
            date: 'Aug 02, 2023',
            score: 54,
            change: 11,
            photos: 4,
            bio_length: 120,
            status: 'Archived'
        }
    ];

    return (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Version History</h1>
                    <p className="text-white/60">Track your profile improvements over time.</p>
                </div>
                <Link to="/new-version" className="btn-primary flex items-center gap-2">
                    Create New Version
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 md:ml-8 space-y-12">
                {versions.map((ver, idx) => (
                    <motion.div
                        key={ver.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-8 md:pl-12"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-black ${idx === 0 ? 'bg-primary' : 'bg-white/30'
                            }`}></div>

                        <div className={`glass-card p-6 transition-all ${idx === 0 ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5'
                            }`}>
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">Version {versions.length - idx}.0</h3>
                                        {idx === 0 && (
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                                        <Calendar className="w-4 h-4" />
                                        {ver.date}
                                    </div>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <span className="block text-white/40 text-xs uppercase tracking-wider">Photos</span>
                                            <span className="font-medium">{ver.photos}</span>
                                        </div>
                                        <div>
                                            <span className="block text-white/40 text-xs uppercase tracking-wider">Bio Length</span>
                                            <span className="font-medium">{ver.bio_length} chars</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {/* Score */}
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-1">{ver.score}</div>
                                        <div className="text-xs text-white/40 uppercase tracking-wider">Rizz Score</div>
                                    </div>

                                    {/* Change Indicator */}
                                    {idx < versions.length - 1 && (
                                        <div className={`flex flex-col items-center text-sm ${ver.change > 0 ? 'text-green-400' : ver.change < 0 ? 'text-red-400' : 'text-white/40'
                                            }`}>
                                            {ver.change > 0 ? <TrendingUp className="w-5 h-5 mb-1" /> :
                                                ver.change < 0 ? <TrendingDown className="w-5 h-5 mb-1" /> :
                                                    <Minus className="w-5 h-5 mb-1" />
                                            }
                                            <span>{ver.change > 0 ? '+' : ''}{ver.change}pts</span>
                                        </div>
                                    )}

                                    <Link
                                        to={idx === 0 ? "/dashboard" : "#"}
                                        className="btn-secondary py-2 px-4 text-sm ml-4"
                                    >
                                        View Report
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default VersionHistory;
