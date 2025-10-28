
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompanionSettings, DEFAULT_AVATARS, getAvatarName, getAvatarGender } from '@/types/chat';

const STORAGE_KEY = '@companion_settings';

const DEFAULT_SETTINGS: CompanionSettings = {
  name: getAvatarName(DEFAULT_AVATARS[0]),
  gender: getAvatarGender(DEFAULT_AVATARS[0]),
  personality: 'sweet',
  avatar: DEFAULT_AVATARS[0],
};

export function useCompanionSettings() {
  const [settings, setSettings] = useState<CompanionSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading companion settings from storage...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Companion settings loaded:', stored ? 'Found' : 'Not found');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure the name and gender match the avatar
        const finalName = getAvatarName(parsed.avatar);
        const finalGender = getAvatarGender(parsed.avatar);
        setSettings({
          ...parsed,
          name: finalName,
          gender: finalGender,
        });
      }
    } catch (error) {
      console.log('Error loading companion settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: CompanionSettings) => {
    try {
      console.log('Saving companion settings to storage...', newSettings);
      // Ensure the name and gender match the avatar (hardcoded)
      const finalSettings = {
        ...newSettings,
        name: getAvatarName(newSettings.avatar),
        gender: getAvatarGender(newSettings.avatar),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalSettings));
      setSettings(finalSettings);
      console.log('Companion settings saved successfully with hardcoded gender:', finalSettings.gender);
    } catch (error) {
      console.log('Error saving companion settings:', error);
      throw error;
    }
  };

  return { settings, saveSettings, loading };
}
