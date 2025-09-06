import React, { useState, useCallback, useEffect } from 'react';
import StoryInput from './components/StoryInput';
import LoadingIndicator from './components/LoadingIndicator';
import ComicPreview from './components/ComicPreview';
import ApiKeySetup from './components/ApiKeySetup';
import { generateMangaScriptAndImages } from './services/geminiService';
import type { MangaStyle, LoadingState } from './types';

function App() {
    const [apiKey, setApiKey] = useState<string>('');
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [author, setAuthor] = useState('');
    const [style, setStyle] = useState<MangaStyle>('Shonen');
    const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, message: '', progress: 0 });
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Check for stored API key on component mount
    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!title.trim() || !story.trim() || !author.trim()) return;

        setError(null);
        setGeneratedImages([]);
        setLoadingState({ isLoading: true, message: 'Starting...', progress: 0 });

        try {
            const images = await generateMangaScriptAndImages(
                { title, story, author, style },
                (progressUpdate) => setLoadingState(progressUpdate),
                apiKey
            );
            setGeneratedImages(images);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Manga generation failed: ${errorMessage} Please check the console for details and try again.`);
            console.error(err);
        } finally {
            setLoadingState({ isLoading: false, message: '', progress: 0 });
        }
    }, [title, story, author, style]);

    const handleReset = useCallback(() => {
        setTitle('');
        setStory('');
        setAuthor('');
        setStyle('Shonen');
        setGeneratedImages([]);
        setError(null);
        setLoadingState({ isLoading: false, message: '', progress: 0 });
    }, []);

    const handleApiKeySet = useCallback((newApiKey: string) => {
        setApiKey(newApiKey);
    }, []);

    const renderContent = () => {
        // Show API key setup if no key is available
        if (!apiKey) {
            return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
        }
        
        if (loadingState.isLoading) {
            return <LoadingIndicator loadingState={loadingState} />;
        }
        if (generatedImages.length > 0) {
            return <ComicPreview images={generatedImages} title={title} onReset={handleReset} />;
        }
        return (
            <StoryInput
                title={title}
                onTitleChange={setTitle}
                story={story}
                onStoryChange={setStory}
                author={author}
                onAuthorChange={setAuthor}
                style={style}
                onStyleChange={setStyle}
                onGenerate={handleGenerate}
                disabled={loadingState.isLoading}
            />
        );
    };

    return (
        <div className="min-h-screen text-white">
            <header className="relative overflow-hidden py-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/30 backdrop-blur-sm"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-4 animate-fade-in">
                            Comic <span className="gradient-text">Genesis</span> AI
                        </h1>
                        <p className="text-xl sm:text-2xl text-white/80 mb-2 animate-slide-in">
                            Professional Comic Book Creation Studio
                        </p>
                        <p className="text-lg text-white/60 animate-slide-in">
                            Transform your stories into stunning visual narratives with AI-powered artistry
                        </p>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    {error && (
                        <div className="glass-card border-red-400 bg-red-500/20 text-red-100 px-6 py-4 mb-8 animate-fade-in" role="alert">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <strong className="font-bold">Creation Error: </strong>
                                    <span>{error}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {renderContent()}
                </div>
            </main>
            
            <footer className="text-center py-8 px-4 text-white/50 text-sm border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <p className="mb-2">🎨 Powered by Google Gemini Nanobanana • Built for Professional Comic Creators</p>
                    <p className="text-xs">Advanced AI storytelling and visual generation technology</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
