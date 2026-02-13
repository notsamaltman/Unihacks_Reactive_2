import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUpload({ files, setFiles, maxFiles = 6 }) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (newFiles) => {
        // Filter for images and limit count
        const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
        if (files.length + validFiles.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} photos.`);
            return;
        }
        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${dragActive ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-white/5">
                        <Upload className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <p className="text-lg font-medium">Drag & drop your photos here</p>
                        <p className="text-white/50 text-sm mt-1">or click to browse</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="btn-secondary py-2 px-6 text-sm"
                    >
                        Select Files
                    </button>
                </div>
            </div>

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <AnimatePresence>
                        {files.map((file, idx) => (
                            <motion.div
                                key={idx} // In prod use unique ID
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-[3/4] rounded-lg overflow-hidden group border border-white/10"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
