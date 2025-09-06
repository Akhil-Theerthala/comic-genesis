import React, { useState } from 'react';
import type { MangaStyle, StoryTemplate } from '../types';

interface StoryInputProps {
    title: string;
    onTitleChange: (title: string) => void;
    story: string;
    onStoryChange: (story: string) => void;
    author: string;
    onAuthorChange: (author: string) => void;
    style: MangaStyle;
    onStyleChange: (style: MangaStyle) => void;
    onGenerate: () => void;
    disabled: boolean;
}

const styles: { name: MangaStyle; description: string; color: string }[] = [
    { name: 'Shonen', description: 'Action-packed, dynamic art', color: 'from-red-500 to-orange-500' },
    { name: 'Shojo', description: 'Romantic, expressive, detailed', color: 'from-pink-500 to-rose-500' },
    { name: 'Seinen', description: 'Mature, realistic, intricate', color: 'from-gray-600 to-gray-800' },
    { name: 'Chibi', description: 'Cute, simple, super-deformed', color: 'from-yellow-400 to-orange-400' },
];

const storyTemplates: StoryTemplate[] = [
    {
        id: 'hero-journey',
        name: 'Hero\'s Journey',
        description: 'Classic adventure following a hero\'s transformation',
        structure: '3-Act Structure with Call to Adventure',
        genre: 'Adventure/Fantasy',
        prompt: 'Create a story following the hero\'s journey structure with a reluctant protagonist who must overcome personal fears to save their world.',
        icon: '⚔️'
    },
    {
        id: 'mystery-thriller',
        name: 'Mystery Thriller',
        description: 'Suspenseful investigation with plot twists',
        structure: 'Investigation Arc with Red Herrings',
        genre: 'Mystery/Thriller',
        prompt: 'Develop a gripping mystery where a detective uncovers a conspiracy that reaches deeper than initially suspected.',
        icon: '🔍'
    },
    {
        id: 'slice-of-life',
        name: 'Slice of Life',
        description: 'Character-driven everyday moments',
        structure: 'Character Development Arc',
        genre: 'Drama/Comedy',
        prompt: 'Tell a heartwarming story about ordinary people finding extraordinary meaning in everyday moments.',
        icon: '🌸'
    },
    {
        id: 'sci-fi-adventure',
        name: 'Sci-Fi Adventure',
        description: 'Futuristic world with advanced technology',
        structure: 'World-building + Quest Structure',
        genre: 'Science Fiction',
        prompt: 'Craft a futuristic adventure where advanced technology creates both solutions and new problems for humanity.',
        icon: '🚀'
    },
    {
        id: 'romance-drama',
        name: 'Romance Drama',
        description: 'Emotional love story with obstacles',
        structure: 'Relationship Arc with Conflict',
        genre: 'Romance/Drama',
        prompt: 'Create a touching romance where two characters must overcome personal and external obstacles to find happiness.',
        icon: '💕'
    },
    {
        id: 'custom',
        name: 'Custom Story',
        description: 'Start with your own unique premise',
        structure: 'Flexible Structure',
        genre: 'Any Genre',
        prompt: '',
        icon: '✨'
    }
];

const StoryInput: React.FC<StoryInputProps> = ({ title, onTitleChange, story, onStoryChange, author, onAuthorChange, style, onStyleChange, onGenerate, disabled }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleTemplateSelect = (template: StoryTemplate) => {
        setSelectedTemplate(template.id);
        if (template.prompt && template.id !== 'custom') {
            onStoryChange(template.prompt);
        }
    };

    return (
        <div className="space-y-8">
            {/* Story Templates Section */}
            <div className="glass-card p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    📚 Story Templates
                    <span className="ml-3 text-sm font-normal text-white/70">Choose a foundation for your comic</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {storyTemplates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => !disabled && handleTemplateSelect(template)}
                            className={`template-card cursor-pointer ${
                                selectedTemplate === template.id
                                    ? 'selected ring-2 ring-white/50'
                                    : 'hover:bg-white/20'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-2xl mb-3">{template.icon}</div>
                            <h3 className="font-bold text-white mb-2">{template.name}</h3>
                            <p className="text-sm text-white/80 mb-2">{template.description}</p>
                            <div className="text-xs text-white/60">
                                <div className="mb-1">📖 {template.structure}</div>
                                <div>🎭 {template.genre}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Input Section */}
            <div className="glass-card p-8 space-y-6 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-semibold text-white/90 flex items-center">
                            📖 Comic Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="e.g., The Last Cherry Blossom"
                            className="w-full input-glass"
                            disabled={disabled}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="author" className="text-sm font-semibold text-white/90 flex items-center">
                            ✍️ Author's Name
                        </label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => onAuthorChange(e.target.value)}
                            placeholder="e.g., Kenji Tanaka"
                            className="w-full input-glass"
                            disabled={disabled}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="story" className="text-sm font-semibold text-white/90 flex items-center justify-between">
                        <span>🎬 Your Story Premise</span>
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-xs text-white/60 hover:text-white/80 transition-colors"
                        >
                            {showAdvanced ? '⬆️ Hide Tips' : '⬇️ Writing Tips'}
                        </button>
                    </label>
                    
                    {showAdvanced && (
                        <div className="bg-white/10 rounded-lg p-4 mb-4 text-sm text-white/80 animate-fade-in">
                            <h4 className="font-semibold mb-2">💡 Storytelling Tips:</h4>
                            <ul className="space-y-1 text-xs">
                                <li>• Start with a compelling hook or conflict</li>
                                <li>• Introduce clear character motivations</li>
                                <li>• Include specific settings and visual elements</li>
                                <li>• Think about the emotional journey</li>
                                <li>• Consider what makes your story unique</li>
                            </ul>
                        </div>
                    )}
                    
                    <textarea
                        id="story"
                        value={story}
                        onChange={(e) => onStoryChange(e.target.value)}
                        placeholder="Describe your story idea... What happens? Who are the characters? What's the central conflict or journey?"
                        className="w-full h-32 input-glass resize-none"
                        disabled={disabled}
                    />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center">
                        🎨 Art Style
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {styles.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => onStyleChange(s.name)}
                                disabled={disabled}
                                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 backdrop-blur-sm ${
                                    style === s.name
                                        ? `bg-gradient-to-br ${s.color} text-white border-white/50 shadow-lg scale-105`
                                        : 'bg-white/10 text-white border-white/20 hover:border-white/40 hover:bg-white/20 hover:scale-102'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className="font-bold block text-sm">{s.name}</span>
                                <span className="text-xs block mt-1 opacity-90">{s.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onGenerate}
                    disabled={disabled || !title.trim() || !story.trim() || !author.trim()}
                    className={`w-full btn-primary text-lg font-bold py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed ${
                        disabled ? '' : 'hover:scale-105'
                    } transition-all duration-300`}
                >
                    {disabled ? (
                        <span className="flex items-center justify-center">
                            <div className="spinner mr-3"></div>
                            Creating Your Comic...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            🚀 Generate Professional Comic
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default StoryInput;