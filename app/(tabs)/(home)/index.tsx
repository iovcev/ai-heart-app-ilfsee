
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useCompanionSettings } from '@/hooks/useCompanionSettings';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function HomeScreen() {
  const { settings } = useCompanionSettings();
  const { messages } = useChatMessages();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: settings.avatar }} style={styles.avatar} />
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.companionName}>{settings.name}</Text>
          <Text style={styles.companionPersonality}>
            {settings.personality.charAt(0).toUpperCase() + settings.personality.slice(1)} Personality
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{messages.length}</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="heart.fill" size={32} color={colors.secondary} />
            <Text style={styles.statValue}>
              {Math.floor(messages.length / 2)}
            </Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={styles.actionIcon}>
              <IconSymbol name="bubble.left.and.bubble.right.fill" size={28} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Start Chatting</Text>
              <Text style={styles.actionDescription}>
                Talk with {settings.name}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <View style={styles.actionIcon}>
              <IconSymbol name="gear" size={28} color={colors.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Customize Companion</Text>
              <Text style={styles.actionDescription}>
                Change personality, name, and more
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.actionIcon}>
              <IconSymbol name="person.fill" size={28} color={colors.accent} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Profile & Stats</Text>
              <Text style={styles.actionDescription}>
                View your activity and manage data
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <IconSymbol name="lightbulb.fill" size={20} color={colors.primary} />
          <Text style={styles.tipText}>
            Tip: Try different personalities to find the conversation style that suits you best!
          </Text>
        </View>
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
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: colors.accent,
    borderWidth: 4,
    borderColor: colors.card,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  companionName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  companionPersonality: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '20',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});
