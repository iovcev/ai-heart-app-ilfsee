
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useApiKey } from '@/hooks/useApiKey';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function ProfileScreen() {
  const { apiKey, clearApiKey } = useApiKey();
  const { messages, clearMessages } = useChatMessages();

  const handleClearApiKey = () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to remove your OpenAI API key? You will need to re-enter it to use the chat feature.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearApiKey();
            Alert.alert('Success', 'API key has been cleared.');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all messages and reset your companion settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearMessages();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profile',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <IconSymbol name="key.fill" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>API Key Status</Text>
                <Text style={styles.infoValue}>
                  {apiKey ? 'Configured ✓' : 'Not Set'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <IconSymbol name="gear" size={20} color={colors.primary} />
            <Text style={styles.buttonText}>Manage API Key</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.card}>
            <View style={styles.statRow}>
              <IconSymbol name="bubble.left.and.bubble.right.fill" size={24} color={colors.secondary} />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{messages.length}</Text>
                <Text style={styles.statLabel}>Total Messages</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          {apiKey && (
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleClearApiKey}
            >
              <IconSymbol name="key.slash.fill" size={20} color={colors.highlight} />
              <Text style={[styles.buttonText, styles.dangerText]}>Clear API Key</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearAllData}
          >
            <IconSymbol name="trash.fill" size={20} color={colors.highlight} />
            <Text style={[styles.buttonText, styles.dangerText]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              AI Companion Chat App
            </Text>
            <Text style={styles.aboutSubtext}>
              Version 1.0.0
            </Text>
            <Text style={styles.disclaimerText}>
              This app uses OpenAI&apos;s API to generate responses. Your API key is stored locally on your device and is never shared with third parties.
            </Text>
          </View>
        </View>

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.highlight + '40',
  },
  dangerText: {
    color: colors.highlight,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
});
