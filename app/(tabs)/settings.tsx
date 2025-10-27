
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useCompanionSettings } from '@/hooks/useCompanionSettings';
import { useApiKey } from '@/hooks/useApiKey';
import {
  Personality,
  PERSONALITY_DESCRIPTIONS,
  DEFAULT_AVATARS,
} from '@/types/chat';

export default function SettingsScreen() {
  const { settings, saveSettings, loading: settingsLoading } = useCompanionSettings();
  const { apiKey, saveApiKey, loading: apiKeyLoading } = useApiKey();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('neutral');
  const [personality, setPersonality] = useState<Personality>('sweet');
  const [avatar, setAvatar] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when hooks finish loading
  useEffect(() => {
    if (!settingsLoading) {
      console.log('Settings loaded, updating local state:', settings);
      setName(settings.name);
      setGender(settings.gender);
      setPersonality(settings.personality);
      setAvatar(settings.avatar);
    }
  }, [settingsLoading, settings]);

  useEffect(() => {
    if (!apiKeyLoading) {
      console.log('API key loaded, updating local state:', apiKey ? 'Present' : 'Empty');
      setApiKeyInput(apiKey);
    }
  }, [apiKeyLoading, apiKey]);

  const handleSave = async () => {
    console.log('Save button pressed');
    
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your companion.');
      return;
    }

    if (!apiKeyInput.trim()) {
      Alert.alert(
        'API Key Required',
        'Please enter your OpenAI API key to use the chat feature. You can get one from platform.openai.com/api-keys',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSaving(true);

    try {
      // Save companion settings
      const newSettings = {
        name: name.trim(),
        gender,
        personality,
        avatar,
      };
      console.log('Saving settings:', newSettings);
      await saveSettings(newSettings);

      // Save API key
      console.log('Saving API key');
      await saveApiKey(apiKeyInput.trim());

      Alert.alert('Success', 'Settings saved successfully!', [{ text: 'OK' }]);
    } catch (error) {
      console.log('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (settingsLoading || apiKeyLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <Text style={styles.sectionDescription}>
            Required to use the chat feature. Get your API key from platform.openai.com/api-keys
          </Text>
          <View style={styles.apiKeyContainer}>
            <TextInput
              style={styles.apiKeyInput}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="sk-..."
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showApiKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowApiKey(!showApiKey)}
            >
              <IconSymbol
                name={showApiKey ? 'eye.slash.fill' : 'eye.fill'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {!apiKeyInput && (
            <View style={styles.warningBox}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.highlight} />
              <Text style={styles.warningText}>
                API key is required to use the chat feature
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Companion Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter companion name"
            placeholderTextColor={colors.textSecondary}
            maxLength={20}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.optionsRow}>
            {(['male', 'female', 'neutral'] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.optionButton, gender === g && styles.optionButtonActive]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[styles.optionText, gender === g && styles.optionTextActive]}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          {(['sweet', 'witty', 'deep', 'flirty'] as Personality[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.personalityCard,
                personality === p && styles.personalityCardActive,
              ]}
              onPress={() => setPersonality(p)}
            >
              <View style={styles.personalityContent}>
                <Text
                  style={[
                    styles.personalityTitle,
                    personality === p && styles.personalityTitleActive,
                  ]}
                >
                  {PERSONALITY_DESCRIPTIONS[p].split(' - ')[0]}
                </Text>
                <Text style={styles.personalityDescription}>
                  {PERSONALITY_DESCRIPTIONS[p].split(' - ')[1]}
                </Text>
              </View>
              {personality === p && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <View style={styles.avatarGrid}>
            {DEFAULT_AVATARS.map((avatarUrl, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  avatar === avatarUrl && styles.avatarOptionActive,
                ]}
                onPress={() => setAvatar(avatarUrl)}
              >
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                {avatar === avatarUrl && (
                  <View style={styles.avatarCheckmark}>
                    <IconSymbol name="checkmark" size={16} color={colors.card} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButtonLarge, isSaving && styles.saveButtonLargeDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.card} />
          ) : (
            <Text style={styles.saveButtonLargeText}>Save Settings</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  apiKeyInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.highlight,
    marginLeft: 8,
    flex: 1,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  optionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  personalityCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  personalityContent: {
    flex: 1,
  },
  personalityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  personalityTitleActive: {
    color: colors.primary,
  },
  personalityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarOptionActive: {
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarCheckmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  saveButtonLarge: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  saveButtonLargeDisabled: {
    opacity: 0.6,
  },
  saveButtonLargeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  bottomSpacer: {
    height: 100,
  },
});
