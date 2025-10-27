
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { DEFAULT_AVATARS } from '@/types/chat';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to AI Companion</Text>
          <Text style={styles.subtitle}>
            Your personal AI friend for emotional connection and conversation
          </Text>
        </View>

        <View style={styles.avatarsContainer}>
          <View style={styles.avatarRow}>
            {DEFAULT_AVATARS.slice(0, 3).map((avatar, index) => (
              <Image key={index} source={{ uri: avatar }} style={styles.avatar} />
            ))}
          </View>
          <View style={styles.avatarRow}>
            {DEFAULT_AVATARS.slice(3, 6).map((avatar, index) => (
              <Image key={index} source={{ uri: avatar }} style={styles.avatar} />
            ))}
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="heart.fill" size={32} color={colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Emotional Support</Text>
            <Text style={styles.featureText}>
              Chat with an AI that understands and responds to your emotions
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <IconSymbol name="sparkles" size={32} color={colors.secondary} />
            </View>
            <Text style={styles.featureTitle}>Multiple Personalities</Text>
            <Text style={styles.featureText}>
              Choose from sweet, witty, deep, or flirty personalities
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.accent + '20' }]}>
              <IconSymbol name="lock.fill" size={32} color={colors.accent} />
            </View>
            <Text style={styles.featureTitle}>Private & Secure</Text>
            <Text style={styles.featureText}>
              All conversations stay on your device. Your privacy is protected.
            </Text>
          </View>
        </View>

        <View style={styles.disclaimerBox}>
          <IconSymbol name="exclamationmark.triangle" size={24} color={colors.highlight} />
          <Text style={styles.disclaimerText}>
            This is a fictional AI companion powered by OpenAI. It is not a real person and should
            not replace professional mental health support.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.replace('/(tabs)/(home)/')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.card,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.highlight + '40',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
