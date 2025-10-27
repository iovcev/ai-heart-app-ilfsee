
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
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
  const { settings, saveSettings } = useCompanionSettings();
  const { apiKey, saveApiKey } = useApiKey();

  const [name, setName] = useState(settings.name);
  const [selectedGender, setSelectedGender] = useState(settings.gender);
  const [selectedPersonality, setSelectedPersonality] = useState(settings.personality);
  const [selectedAvatar, setSelectedAvatar] = useState(settings.avatar);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your companion');
      return;
    }

    saveSettings({
      name: name.trim(),
      gender: selectedGender,
      personality: selectedPersonality,
      avatar: selectedAvatar,
    });

    if (apiKeyInput !== apiKey) {
      saveApiKey(apiKeyInput);
    }

    Alert.alert('Success', 'Settings saved successfully!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Companion Settings',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Avatar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarList}
          >
            {DEFAULT_AVATARS.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAvatar(avatar)}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar && styles.avatarOptionSelected,
                ]}
              >
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                {selectedAvatar === avatar && (
                  <View style={styles.avatarCheck}>
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Companion Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter name..."
            placeholderTextColor={colors.textSecondary}
            maxLength={20}
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.optionsRow}>
            {(['male', 'female', 'neutral'] as const).map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.optionButton,
                  selectedGender === gender && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGender === gender && styles.optionTextSelected,
                  ]}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personality Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          {(['sweet', 'witty', 'deep', 'flirty'] as Personality[]).map((personality) => (
            <TouchableOpacity
              key={personality}
              style={[
                styles.personalityCard,
                selectedPersonality === personality && styles.personalityCardSelected,
              ]}
              onPress={() => setSelectedPersonality(personality)}
            >
              <View style={styles.personalityHeader}>
                <Text
                  style={[
                    styles.personalityTitle,
                    selectedPersonality === personality && styles.personalityTitleSelected,
                  ]}
                >
                  {personality.charAt(0).toUpperCase() + personality.slice(1)}
                </Text>
                {selectedPersonality === personality && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                )}
              </View>
              <Text style={styles.personalityDescription}>
                {PERSONALITY_DESCRIPTIONS[personality]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* API Key Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <Text style={styles.sectionSubtitle}>
            Required for chat functionality. Get your key from platform.openai.com
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
                name={showApiKey ? 'eye.slash' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <IconSymbol name="info.circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Your API key is stored securely on your device and never shared. All conversations are
            private.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  avatarList: {
    gap: 12,
  },
  avatarOption: {
    position: 'relative',
  },
  avatarOptionSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 40,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
  },
  avatarCheck: {
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
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.accent + '40',
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
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  personalityCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  personalityCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  personalityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personalityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  personalityTitleSelected: {
    color: colors.primary,
  },
  personalityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  apiKeyInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(233, 30, 99, 0.3)',
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
