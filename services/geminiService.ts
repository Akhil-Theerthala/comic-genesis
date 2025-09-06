import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { LoadingState, MangaPage, CharacterProfile, MangaStyle } from '../types';

// Initialize GoogleGenAI client - will be created dynamically with user's API key
let ai: GoogleGenAI;

interface StoryDetails {
    title: string;
    story: string;
    author: string;
    style: MangaStyle;
}

// Schema for character profile generation
const characterProfileSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "The character's name.",
            },
            description: {
                type: Type.STRING,
                description: "A detailed visual and personality description of the character suitable for an artist."
            },
        },
        required: ['name', 'description'],
    },
};


// Schema for manga script generation
const mangaPageSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            pageNumber: { type: Type.INTEGER },
            panels: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        panelNumber: { type: Type.INTEGER },
                        description: {
                            type: Type.STRING,
                            description: "A detailed visual description of the action and setting in the panel. No dialogue."
                        },
                        dialogue: {
                            type: Type.STRING,
                            description: "The dialogue spoken in the panel. Can be empty."
                        },
                        speaker: {
                            type: Type.STRING,
                            description: "Who is speaking the dialogue. Can be 'Narrator' or a character name."
                        },
                    },
                    required: ['panelNumber', 'description'],
                },
            },
        },
        required: ['pageNumber', 'panels'],
    },
};

/**
 * Generates character profiles from a story premise with advanced character development.
 */
const generateCharacterProfiles = async (story: string, style: MangaStyle): Promise<CharacterProfile[]> => {
    const prompt = `You are a master character designer and development expert specializing in compelling visual storytelling. Create rich, multi-dimensional character profiles that will serve as the foundation for a professional comic series.

ADVANCED CHARACTER DEVELOPMENT BRIEF:
Style: ${style} manga aesthetic with professional character design principles
Story Context: "${story}"

CHARACTER CREATION GUIDELINES:
1. VISUAL DISTINCTIVENESS: Each character must have unique, memorable visual traits
2. PERSONALITY DEPTH: Include both strengths and meaningful flaws/conflicts
3. STORY FUNCTION: Each character should serve a clear narrative purpose
4. VISUAL CONSISTENCY: Provide specific details for artistic consistency (eye color, hair style, clothing, etc.)
5. EMOTIONAL RANGE: Consider how the character will express different emotions visually

TECHNICAL SPECIFICATIONS:
- Create 2-4 main characters (protagonists, deuteragonists, key supporting characters)
- Each character needs comprehensive visual and personality descriptions
- Include distinctive features that work well in ${style} art style
- Consider character relationships and visual contrast between characters
- Ensure characters can drive the story forward through their actions and conflicts

ADVANCED REQUIREMENTS:
- Give each character a clear goal/motivation
- Include internal conflicts that create character growth opportunities
- Design visual elements that reflect personality (clothing choices, posture, etc.)
- Consider how characters will look in different emotional states and action sequences
- Ensure diversity in character types while maintaining narrative coherence

Generate character profiles that will enable consistent, professional comic book character design and compelling character-driven storytelling.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: characterProfileSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CharacterProfile[];
    } catch (e) {
        console.error("Error generating character profiles:", e);
        throw new Error("Failed to generate character profiles from the story.");
    }
};

/**
 * Generates advanced narrative structure analysis
 */
const analyzeNarrativeStructure = (story: string): { structure: string; keyBeats: string[] } => {
    // Identify potential story structure based on content
    const heroKeywords = ['journey', 'quest', 'adventure', 'hero', 'save', 'rescue', 'destiny'];
    const mysteryKeywords = ['mystery', 'detective', 'investigate', 'clue', 'solve', 'suspect', 'hidden'];
    const romanceKeywords = ['love', 'relationship', 'heart', 'romance', 'together', 'feelings'];
    const scifiKeywords = ['future', 'space', 'technology', 'robot', 'alien', 'planet', 'sci-fi'];
    
    const storyLower = story.toLowerCase();
    
    if (heroKeywords.some(keyword => storyLower.includes(keyword))) {
        return {
            structure: "Hero's Journey",
            keyBeats: [
                "Ordinary World & Call to Adventure",
                "Crossing the Threshold & First Challenge",
                "Trials and Revelations",
                "Climax and Return Transformed"
            ]
        };
    } else if (mysteryKeywords.some(keyword => storyLower.includes(keyword))) {
        return {
            structure: "Mystery Investigation",
            keyBeats: [
                "Crime/Mystery Introduction",
                "Investigation & Red Herrings",
                "Major Revelation & Twist",
                "Resolution & Truth Revealed"
            ]
        };
    } else if (romanceKeywords.some(keyword => storyLower.includes(keyword))) {
        return {
            structure: "Romance Arc",
            keyBeats: [
                "Meet Cute & Initial Attraction",
                "Building Connection & Obstacles",
                "Crisis & Near Loss",
                "Resolution & Happy Ending"
            ]
        };
    } else if (scifiKeywords.some(keyword => storyLower.includes(keyword))) {
        return {
            structure: "Sci-Fi Adventure",
            keyBeats: [
                "World Setup & Inciting Incident",
                "Exploration & Discovery",
                "Conflict & High Stakes",
                "Resolution & Future Implications"
            ]
        };
    } else {
        return {
            structure: "Three-Act Structure",
            keyBeats: [
                "Setup & Character Introduction",
                "Rising Action & Complications",
                "Climax & High Stakes",
                "Resolution & Character Growth"
            ]
        };
    }
};

/**
 * Generates a manga script from a story premise and character profiles.
 */
const generateMangaScript = async (story: string, style: MangaStyle, characters: CharacterProfile[]): Promise<MangaPage[]> => {
    const characterDescriptions = characters.map(c => `- ${c.name}: ${c.description}`).join('\n');
    const narrativeAnalysis = analyzeNarrativeStructure(story);
    
    const prompt = `You are a master storyteller and comic book editor with decades of experience creating compelling visual narratives. Your expertise spans multiple genres and you understand the delicate balance between visual storytelling and narrative pacing.

ADVANCED STORYTELLING ANALYSIS:
Story Structure Detected: ${narrativeAnalysis.structure}
Key Narrative Beats: ${narrativeAnalysis.keyBeats.join(' → ')}

STORY ENHANCEMENT MISSION:
Transform this premise into a professional comic script that maximizes emotional impact and reader engagement. Apply advanced storytelling techniques:

1. HOOK: Create an immediate visual and emotional hook in the first panel
2. CHARACTER ARCS: Ensure each character has clear motivation and growth
3. PACING: Use panel composition to control story rhythm (close-ups for emotion, wide shots for action)
4. VISUAL STORYTELLING: Show don't tell - use visual metaphors and symbolism
5. CLIFFHANGERS: End pages with compelling moments that drive page-turns
6. CLIMAX: Build to a satisfying emotional and visual climax

TECHNICAL SPECIFICATIONS:
- Visual Style: ${style} manga aesthetic with professional composition
- Page Count: 4-5 pages optimized for digital reading
- Panel Density: 2-4 panels per page with dynamic layouts
- Dialogue: Concise, character-driven, emotionally resonant

CHARACTER CAST:
${characterDescriptions}

STORY PREMISE TO ENHANCE:
"${story}"

INSTRUCTIONS:
1. First, mentally outline the enhanced story following the ${narrativeAnalysis.structure} structure
2. Identify the key emotional moments and visual set pieces
3. Plan panel compositions that support the narrative flow
4. Create a script where each panel serves both story and visual impact
5. Ensure dialogue feels natural and advances both plot and character

Generate a professional comic script that elevates this premise into a compelling visual narrative.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mangaPageSchema,
            },
        });

        const jsonText = response.text.trim();
        let pages = JSON.parse(jsonText) as MangaPage[];
        // Sort pages just in case the model doesn't return them in order
        pages.sort((a, b) => a.pageNumber - b.pageNumber);
        return pages;
    } catch (e) {
        console.error("Error generating manga script:", e);
        throw new Error("Failed to generate the manga script.");
    }
};

/**
 * Determines optimal panel composition based on story beat and emotional content
 */
const analyzePageComposition = (page: MangaPage, style: MangaStyle): string => {
    const panelCount = page.panels.length;
    const hasAction = page.panels.some(p => 
        p.description.toLowerCase().includes('action') || 
        p.description.toLowerCase().includes('fight') || 
        p.description.toLowerCase().includes('explosion') ||
        p.description.toLowerCase().includes('running') ||
        p.description.toLowerCase().includes('chase')
    );
    
    const hasEmotion = page.panels.some(p => 
        p.description.toLowerCase().includes('emotional') || 
        p.description.toLowerCase().includes('tears') || 
        p.description.toLowerCase().includes('close-up') ||
        p.description.toLowerCase().includes('reaction') ||
        p.description.toLowerCase().includes('shock')
    );
    
    const hasDialogue = page.panels.some(p => p.dialogue && p.dialogue.trim().length > 0);
    
    // Determine composition style
    if (hasAction && panelCount <= 3) {
        return "DYNAMIC ACTION LAYOUT: Use large, impactful panels with diagonal compositions. Include speed lines and dramatic angles.";
    } else if (hasEmotion && panelCount >= 3) {
        return "EMOTIONAL BEATS LAYOUT: Mix close-up reaction shots with medium shots. Use varying panel sizes to control pacing.";
    } else if (hasDialogue && panelCount >= 4) {
        return "DIALOGUE-HEAVY LAYOUT: Use conversational panel flow with clear sight lines between speakers. Balance text and visuals.";
    } else if (style === 'Shonen') {
        return "SHONEN ENERGY LAYOUT: Bold, angular panels with dynamic perspectives. Emphasize movement and power.";
    } else if (style === 'Shojo') {
        return "SHOJO AESTHETIC LAYOUT: Flowing, organic panel shapes with decorative elements. Focus on character expressions.";
    } else if (style === 'Seinen') {
        return "MATURE COMPOSITION: Clean, sophisticated panel layouts with subtle visual metaphors and realistic proportions.";
    } else {
        return "BALANCED COMPOSITION: Professional comic layout with clear visual hierarchy and optimal reading flow.";
    }
};

/**
 * Generates a single manga page image using gemini-2.5-flash-image-preview.
 */
const generatePageImage = async (prompt: string, previousPageImage?: string, page?: MangaPage, style?: MangaStyle): Promise<string> => {
    try {
        const parts: any[] = [];
        
        // Add composition guidance if page data is available
        let enhancedPrompt = prompt;
        if (page && style) {
            const compositionGuide = analyzePageComposition(page, style);
            enhancedPrompt = `${prompt}\n\nCOMPOSITION GUIDANCE:\n${compositionGuide}\n\nPROFESSIONAL COMIC TECHNIQUES:\n- Use proper panel gutters and borders\n- Maintain clear reading flow (left to right, top to bottom)\n- Balance text and visual elements\n- Apply comic book color theory and contrast\n- Ensure character consistency and proportions\n- Use appropriate camera angles and perspectives`;
        }
        
        if (previousPageImage) {
            parts.push({
                text: "--- VISUAL CONSISTENCY REFERENCE ---\nMaintain strict visual consistency with this reference for character designs, art style, color palette, and overall aesthetic. Keep characters recognizable while allowing for natural poses and expressions."
            });
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: previousPageImage,
                },
            });
        }
        parts.push({ text: enhancedPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response?.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (!imagePart || !imagePart.inlineData) {
            console.error("Invalid or empty response from image generation API:", JSON.stringify(response, null, 2));
            throw new Error("AI failed to return a valid image. The response was empty or malformed.");
        }

        return imagePart.inlineData.data;

    } catch (e) {
         if (!(e instanceof Error && e.message.startsWith("AI failed to return"))) {
            console.error("Error generating page image:", e);
        }
        throw new Error(`AI failed to generate an image. Reason: ${e instanceof Error ? e.message : String(e)}`);
    }
};

/**
 * Creates the main manga generation orchestrator.
 */
export const generateMangaScriptAndImages = async (
    storyDetails: StoryDetails,
    updateProgress: (state: LoadingState) => void,
    apiKey: string
): Promise<string[]> => {
    // Initialize AI client with user's API key
    ai = new GoogleGenAI({ apiKey });
    const { title, story, author, style } = storyDetails;
    const allImages: string[] = [];

    // Step 1: Generate Character Profiles
    updateProgress({ isLoading: true, message: 'Analyzing story for characters...', progress: 10 });
    const characters = await generateCharacterProfiles(story, style);

    // Step 2: Generate Manga Script
    updateProgress({ isLoading: true, message: 'Writing manga script...', progress: 25 });
    const scriptPages = await generateMangaScript(story, style, characters);
    if (scriptPages.length === 0) {
        throw new Error("The generated script was empty. Please try a different story.");
    }

    const totalPagesToGenerate = scriptPages.length + 2; // script pages + title + conclusion
    let pagesGenerated = 0;

    const characterPromptPart = characters.map(c => `${c.name}: ${c.description}`).join('; ');

    const updatePageProgress = () => {
        pagesGenerated++;
        // Progress from 40% to 95% is for image generation
        const progress = 40 + Math.round((pagesGenerated / totalPagesToGenerate) * 55);
        return progress;
    };
    
    // Step 3: Generate Title Page
    updateProgress({ isLoading: true, message: 'Creating title page...', progress: 40 });
    const titlePagePrompt = `TASK: Create a dynamic manga title page.
STYLE: ${style}, black and white.
ASPECT RATIO: 3:4 vertical.
TITLE: "${title}"
AUTHOR: "${author}"
CHARACTERS: Feature the main characters: ${characterPromptPart}.
INSTRUCTIONS: Create a compelling cover image. Generate ONLY the image.`;
    const titleImage = await generatePageImage(titlePagePrompt);
    allImages.push(titleImage);


    // Step 4: Generate each page from the script
    for (const page of scriptPages) {
        const progress = updatePageProgress();
        updateProgress({ isLoading: true, message: `Drawing page ${page.pageNumber} of ${scriptPages.length}...`, progress });
        
        const panelPrompts = page.panels.map(p => {
            let panelString = `Panel ${p.panelNumber}: ${p.description}`;
            if (p.dialogue && p.speaker) {
                const speakingCharacter = characters.find(c => c.name === p.speaker);
                if (speakingCharacter) {
                    // Planner Agent: Link the visual description directly to the dialogue.
                    panelString += `\n  - Dialogue: The character speaking is ${speakingCharacter.name} (${speakingCharacter.description}). They say: "${p.dialogue}"`;
                } else {
                    panelString += `\n  - Dialogue (${p.speaker}): "${p.dialogue}"`;
                }
            }
            return panelString;
        }).join('\n\n');

        const pagePrompt = `TASK: Create a manga page image.
STYLE: ${style}, black and white.
ASPECT RATIO: 3:4 vertical.
CHARACTERS: ${characterPromptPart}.
PAGE: ${page.pageNumber}, with ${page.panels.length} panels.

PANEL INSTRUCTIONS:
${panelPrompts}

FINAL INSTRUCTIONS: Arrange panels dynamically. Place dialogue in speech bubbles for the correct characters. Generate ONLY the image.`;
        
        // Pass the last generated image as a reference for consistency
        const previousImage = allImages[allImages.length - 1];
        const pageImage = await generatePageImage(pagePrompt, previousImage, page, style);
        allImages.push(pageImage);
    }

    // Step 5: Generate Conclusion Page
    const conclusionProgress = updatePageProgress();
    updateProgress({ isLoading: true, message: 'Creating conclusion page...', progress: conclusionProgress });
    const conclusionPagePrompt = `TASK: Create a final, evocative manga page.
STYLE: ${style}, black and white.
ASPECT RATIO: 3:4 vertical.
STORY CONTEXT: The story was about "${story}".
INSTRUCTIONS: The page should feel like a conclusion. Maybe a character looking towards the horizon or a symbolic image related to the story. Include a small, stylized "The End" text. Generate ONLY the image.`;
    
    // Pass the last content page as reference for the conclusion
    const lastContentPage = allImages[allImages.length - 1];
    const conclusionImage = await generatePageImage(conclusionPagePrompt, lastContentPage);
    allImages.push(conclusionImage);

    updateProgress({ isLoading: true, message: 'Finishing up...', progress: 100 });
    return allImages;
};