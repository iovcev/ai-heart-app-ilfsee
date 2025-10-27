
import React from "react";
import { Stack, router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { useCompanionSettings } from "@/hooks/useCompanionSettings";

export default function HomeScreen() {
  const { settings } = useCompanionSettings();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "AI Companion",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image source={{ uri: settings.avatar }} style={styles.heroAvatar} />
          <Text style={styles.heroTitle}>Meet {settings.name}</Text>
          <Text style={styles.heroSubtitle}>
            Your AI companion for emotional connection and conversation
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="heart.fill" size={28} color={colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Emotional Connection</Text>
            <Text style={styles.featureDescription}>
              Engage in meaningful conversations with an AI that understands emotions
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
              <IconSymbol name="sparkles" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.featureTitle}>Adaptive Personality</Text>
            <Text style={styles.featureDescription}>
              Choose from different personalities to match your mood
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accent + '20' }]}>
              <IconSymbol name="lock.fill" size={28} color={colors.accent} />
            </View>
            <Text style={styles.featureTitle}>Private & Secure</Text>
            <Text style={styles.featureDescription}>
              All conversations are stored locally on your device
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <Text style={styles.startButtonText}>Start Chatting</Text>
          <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <IconSymbol name="gear" size={20} color={colors.primary} />
          <Text style={styles.settingsButtonText}>Customize Companion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 100 : 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: colors.accent,
    borderWidth: 4,
    borderColor: colors.card,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
