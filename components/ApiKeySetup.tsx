import React, { useState } from 'react';

interface ApiKeySetupProps {
    onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
    const [apiKey, setApiKey] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            // Store in localStorage for convenience (still secure as it's user's own key)
            localStorage.setItem('gemini_api_key', apiKey.trim());
            onApiKeySet(apiKey.trim());
        }
    };

    return (
        <div className="glass-card p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                    🔑 API Key Required
                </h2>
                <p className="text-white/80 text-lg">
                    To generate comics, you'll need your own Google Gemini API key
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-semibold text-white/90 mb-2">
                        Google Gemini API Key
                    </label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key..."
                        className="w-full input-glass"
                        required
                    />
                    <p className="text-white/60 text-xs mt-2">
                        🔒 Your API key is stored locally and never sent to our servers
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={!apiKey.trim()}
                    className="w-full btn-primary text-lg font-bold py-4 px-6 disabled:opacity-50"
                >
                    🚀 Start Creating Comics
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center justify-center w-full text-white/70 hover:text-white/90 transition-colors text-sm"
                >
                    {showInstructions ? '⬆️ Hide Instructions' : '⬇️ How to Get API Key'}
                </button>

                {showInstructions && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg text-sm text-white/80 animate-fade-in">
                        <h3 className="font-semibold mb-3">📝 Getting Your Gemini API Key:</h3>
                        <ol className="space-y-2 list-decimal list-inside">
                            <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">Google AI Studio</a></li>
                            <li>Sign in with your Google account</li>
                            <li>Click "Create API Key"</li>
                            <li>Copy the generated key</li>
                            <li>Paste it above to start creating comics!</li>
                        </ol>
                        <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                            <p className="text-yellow-200 text-xs">
                                ⚡ <strong>Free Tier:</strong> Google provides generous free usage for Gemini API - perfect for creating comics!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeySetup;