export interface LoadingState {
  isLoading: boolean;
  message: string;
  progress: number;
}

export interface CharacterProfile {
  name: string;
  description: string;
}

export interface Panel {
  panelNumber: number;
  description: string;
  dialogue: string;
  speaker: string; // The name of the character speaking. Can be 'Narrator' or empty.
}

export interface MangaPage {
  pageNumber: number;
  panels: Panel[];
}

export type MangaStyle = 'Shonen' | 'Shojo' | 'Seinen' | 'Chibi';

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  structure: string;
  genre: string;
  prompt: string;
  icon: string;
}

export interface NarrativeStructure {
  act: number;
  name: string;
  description: string;
  keyElements: string[];
}