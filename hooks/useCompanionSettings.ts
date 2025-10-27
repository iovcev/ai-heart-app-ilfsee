
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
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading companion settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: CompanionSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving companion settings:', error);
    }
  };

  return { settings, saveSettings, loading };
}
