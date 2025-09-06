import React from 'react';
import { createMangaPdf } from '../services/pdfService';

interface ComicPreviewProps {
    images: string[];
    title: string;
    onReset: () => void;
}

const getPageLabel = (index: number, totalImages: number): string => {
    if (index === 0) {
        return 'Title Page';
    }
    if (index === totalImages - 1) {
        return 'Conclusion';
    }
    return `Page ${index}`;
};


const ComicPreview: React.FC<ComicPreviewProps> = ({ images, title, onReset }) => {
    const handleDownload = () => {
        createMangaPdf(images, title);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="glass-card p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                        <h2 className="text-4xl font-bold text-white mb-2 gradient-text">{title}</h2>
                        <p className="text-white/70">
                            🎉 Your comic has been successfully generated! • {images.length} pages created
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="btn-primary px-6 py-3 flex items-center gap-2"
                        >
                            📥 Download PDF
                        </button>
                        <button
                            onClick={onReset}
                            className="btn-secondary px-6 py-3 flex items-center gap-2"
                        >
                            ✨ Create New Comic
                        </button>
                    </div>
                </div>
            </div>

            {/* Comic Pages Gallery */}
            <div className="panel-grid">
                {images.map((imgData, index) => (
                    <div key={index} className="panel-item group">
                        <div className="relative overflow-hidden">
                            <img
                                src={`data:image/jpeg;base64,${imgData}`}
                                alt={`Generated comic page ${index + 1}`}
                                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <p className="text-white font-semibold text-sm">
                                        {getPageLabel(index, images.length)}
                                    </p>
                                    <p className="text-white/80 text-xs">
                                        Page {index + 1} of {images.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-white font-semibold">
                                {getPageLabel(index, images.length)}
                            </h3>
                            <p className="text-white/70 text-sm mt-1">
                                {index === 0 
                                    ? 'Opening cover with title and characters' 
                                    : index === images.length - 1 
                                    ? 'Story conclusion and finale'
                                    : `Story development and character progression`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Section */}
            <div className="glass-card p-6">
                <div className="flex justify-center items-center gap-8 text-center">
                    <div>
                        <div className="text-2xl font-bold text-white">{images.length}</div>
                        <div className="text-white/70 text-sm">Pages Created</div>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div>
                        <div className="text-2xl font-bold text-white">🎨</div>
                        <div className="text-white/70 text-sm">AI Generated</div>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div>
                        <div className="text-2xl font-bold text-white">📖</div>
                        <div className="text-white/70 text-sm">Ready to Read</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicPreview;