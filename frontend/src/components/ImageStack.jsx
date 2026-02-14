import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageStack = ({ files }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % files.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
    };

    if (!files || files.length === 0) {
        return (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/20">
                No Photos
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-900">
            <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                    key={currentIndex}
                    src={(() => {
                        const file = files[currentIndex];
                        if (typeof file === 'string') return file;
                        if (file.url) return file.url;
                        try {
                            return URL.createObjectURL(file);
                        } catch (e) {
                            return '';
                        }
                    })()}
                    alt={`Profile ${currentIndex + 1}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Navigation Buttons */}
            {files.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all backdrop-blur-sm z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all backdrop-blur-sm z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {files.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all ${idx === currentIndex
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageStack;
