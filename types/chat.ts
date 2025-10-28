
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
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=200&h=200&fit=crop',
];

// Mapping of avatars to their fixed names (user cannot change these)
export const AVATAR_NAMES: Record<string, string> = {
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop': 'Alex',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop': 'Sophia',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop': 'Marcus',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop': 'James',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop': 'Isabella',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop': 'Michael',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop': 'Scarlett',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop': 'Natasha',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop': 'Victoria',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop': 'Angelina',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop': 'Olivia',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop': 'Emma',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop': 'Ava',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop': 'Charlotte',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop': 'Mia',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=200&h=200&fit=crop': 'Amelia',
};

// Mapping of avatars to their gender (hardcoded)
export const AVATAR_GENDERS: Record<string, 'male' | 'female' | 'neutral'> = {
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop': 'male',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop': 'male',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop': 'male',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop': 'male',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop': 'female',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=200&h=200&fit=crop': 'female',
};

// Helper function to get the name for an avatar
export function getAvatarName(avatarUrl: string): string {
  return AVATAR_NAMES[avatarUrl] || 'Alex';
}

// Helper function to check if an avatar has a fixed name
export function hasFixedName(avatarUrl: string): boolean {
  return avatarUrl in AVATAR_NAMES;
}

// Helper function to get the gender for an avatar (hardcoded)
export function getAvatarGender(avatarUrl: string): 'male' | 'female' | 'neutral' {
  return AVATAR_GENDERS[avatarUrl] || 'neutral';
}
