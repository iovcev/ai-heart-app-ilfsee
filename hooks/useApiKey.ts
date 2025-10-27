
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@openai_api_key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiKey(stored);
      }
    } catch (error) {
      console.log('Error loading API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (key: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
    } catch (error) {
      console.log('Error saving API key:', error);
    }
  };

  const clearApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setApiKey('');
    } catch (error) {
      console.log('Error clearing API key:', error);
    }
  };

  return { apiKey, saveApiKey, clearApiKey, loading };
}
