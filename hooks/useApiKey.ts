
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
      console.log('Loading API key from storage...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('API key loaded:', stored ? 'Found' : 'Not found');
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
      console.log('Saving API key to storage...');
      await AsyncStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
      console.log('API key saved successfully');
    } catch (error) {
      console.log('Error saving API key:', error);
      throw error;
    }
  };

  const clearApiKey = async () => {
    try {
      console.log('Clearing API key from storage...');
      await AsyncStorage.removeItem(STORAGE_KEY);
      setApiKey('');
      console.log('API key cleared successfully');
    } catch (error) {
      console.log('Error clearing API key:', error);
      throw error;
    }
  };

  return { apiKey, saveApiKey, clearApiKey, loading };
}
