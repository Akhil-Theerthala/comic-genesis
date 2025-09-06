import React from 'react';
import { LoadingState } from '../types';

interface LoadingIndicatorProps {
    loadingState: LoadingState;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loadingState }) => {
    return (
        <div className="glass-card p-8 sm:p-12 text-center animate-fade-in">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        🎨 Creating Your Comic Masterpiece
                    </h2>
                    <p className="text-white/80 text-lg">
                        AI artistry in progress...
                    </p>
                </div>

                {/* Progress Animation */}
                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="spinner animate-pulse-slow"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {loadingState.progress}%
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-6 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-gray-300 via-white to-gray-400 relative overflow-hidden"
                            style={{ width: `${loadingState.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="space-y-4">
                    <p className="text-white font-semibold text-xl">
                        {loadingState.message}
                    </p>
                    
                    {/* Process Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { step: 'Analyzing Story', icon: '📚', active: loadingState.progress >= 10 },
                            { step: 'Creating Characters', icon: '👥', active: loadingState.progress >= 25 },
                            { step: 'Drawing Pages', icon: '🎨', active: loadingState.progress >= 40 },
                            { step: 'Finalizing', icon: '✨', active: loadingState.progress >= 95 }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border transition-all duration-500 ${
                                    item.active 
                                        ? 'bg-white/20 border-white/40 text-white' 
                                        : 'bg-white/5 border-white/10 text-white/50'
                                }`}
                            >
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <div className="text-sm font-medium">{item.step}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-white/60">
                        ⚡ Powered by advanced AI • Crafting your unique visual story
                    </p>
                    <p className="text-xs text-white/40 mt-2">
                        Each page is being carefully composed with professional comic techniques
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;
