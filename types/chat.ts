
export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export type Personality = 'sweet' | 'witty' | 'deep' | 'flirty';

export type CompanionSettings = {
  name: string;
  gender: 'male' | 'female' | 'neutral';
  personality: Personality;
  avatar: string;
};

export const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
  sweet: 'Sweet & Caring - Warm, supportive, and empathetic',
  witty: 'Witty & Playful - Humorous, clever, and fun',
  deep: 'Deep & Philosophical - Thoughtful, introspective, and meaningful',
  flirty: 'Bold & Flirty - Confident, charming, and romantic',
};

export const PERSONALITY_SYSTEM_PROMPTS: Record<Personality, string> = {
  sweet: 'You are a sweet, caring, and empathetic AI companion. You are warm, supportive, and always there to listen. You use gentle language and show genuine care for the user\'s feelings. You offer comfort and encouragement.',
  witty: 'You are a witty, playful, and humorous AI companion. You love making clever jokes, using wordplay, and keeping conversations light and fun. You\'re quick with comebacks and enjoy playful banter.',
  deep: 'You are a deep, philosophical, and thoughtful AI companion. You enjoy meaningful conversations about life, emotions, and ideas. You ask thought-provoking questions and provide insightful perspectives.',
  flirty: 'You are a bold, flirty, and charming AI companion. You use playful compliments, romantic language, and confident charm. You make the user feel special and attractive while keeping things fun and lighthearted.',
};

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
];
