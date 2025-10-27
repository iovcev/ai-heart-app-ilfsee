
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompanionSettings, DEFAULT_AVATARS } from '@/types/chat';

const STORAGE_KEY = '@companion_settings';

const DEFAULT_SETTINGS: CompanionSettings = {
  name: 'Alex',
  gender: 'neutral',
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
        setSettings(parsed);
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      console.log('Companion settings saved successfully');
    } catch (error) {
      console.log('Error saving companion settings:', error);
      throw error;
    }
  };

  return { settings, saveSettings, loading };
}
