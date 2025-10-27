
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useCompanionSettings } from '@/hooks/useCompanionSettings';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useApiKey } from '@/hooks/useApiKey';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import { Message } from '@/types/chat';
import { PERSONALITY_SYSTEM_PROMPTS } from '@/types/chat';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, addMessage, clearMessages, loading: messagesLoading } = useChatMessages();
  const { settings, loading: settingsLoading } = useCompanionSettings();
  const { generateResponse, loading: aiLoading, error: aiError } = useOpenAI();
  const { apiKey, loading: apiKeyLoading } = useApiKey();

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  useEffect(() => {
    // Log when API key is loaded
    if (!apiKeyLoading) {
      console.log('Chat screen - API key loaded:', apiKey ? 'Present' : 'Empty');
    }
  }, [apiKeyLoading, apiKey]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputText.trim();
    console.log('handleSend called with text:', messageText);
    
    if (!messageText) {
      console.log('Empty input, ignoring');
      return;
    }

    if (isSending) {
      console.log('Already sending a message, ignoring');
      return;
    }

    if (!apiKey) {
      console.log('No API key found');
      Alert.alert(
        'API Key Required',
        'Please set your OpenAI API key in the Settings tab to use the chat feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/(tabs)/settings') }
        ]
      );
      return;
    }

    console.log('Creating user message');
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    // Clear input immediately
    setInputText('');
    setIsSending(true);
    setIsTyping(true);

    // Add user message
    addMessage(userMessage);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      }));

      const systemPrompt = PERSONALITY_SYSTEM_PROMPTS[settings.personality];
      const fullPrompt = `${systemPrompt}\n\nYour name is ${settings.name}. Keep responses concise and engaging (2-3 sentences max). Show personality through your responses.`;

      console.log('Generating AI response...');
      const aiResponse = await generateResponse(
        [
          { role: 'system', content: fullPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage.text },
        ],
        apiKey
      );

      console.log('AI response received:', aiResponse ? 'Success' : 'Failed');

      if (aiResponse) {
        console.log('AI response received, adding to messages');
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        };
        addMessage(aiMessage);
      } else {
        console.log('No AI response received');
        Alert.alert(
          'Error',
          aiError || 'Failed to get response from AI. Please check your API key and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error in handleSend:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      // Always reset states
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to delete all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            console.log('Clearing chat messages');
            clearMessages();
          },
        },
      ]
    );
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action pressed:', action);
    
    if (!apiKey) {
      console.log('No API key found for quick action');
      Alert.alert(
        'API Key Required',
        'Please set your OpenAI API key in the Settings tab to use quick actions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/(tabs)/settings') }
        ]
      );
      return;
    }

    if (isSending) {
      console.log('Already processing a message, ignoring quick action');
      return;
    }

    let prompt = '';
    switch (action) {
      case 'date':
        prompt = 'Can you suggest a fun date idea for us?';
        break;
      case 'flirty':
        prompt = 'Help me write a flirty message';
        break;
      case 'feelings':
        prompt = 'I want to express my feelings but I&apos;m not sure how';
        break;
      default:
        console.log('Unknown quick action:', action);
        return;
    }
    
    if (prompt) {
      console.log('Sending quick action prompt:', prompt);
      handleSend(prompt);
    }
  };

  const handleSendPress = () => {
    console.log('Send button/enter pressed, inputText:', inputText);
    console.log('isSending:', isSending);
    if (inputText.trim() && !isSending) {
      handleSend();
    }
  };

  if (messagesLoading || settingsLoading || apiKeyLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Chat',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: settings.name,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/settings')}
              style={styles.headerButton}
            >
              <Image source={{ uri: settings.avatar }} style={styles.avatar} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleClearChat} style={styles.headerButton}>
              <IconSymbol name="trash" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <ScrollView 
            style={styles.emptyScrollView}
            contentContainerStyle={styles.emptyContainer}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: settings.avatar }} style={styles.largeAvatar} />
            <Text style={styles.emptyTitle}>Start chatting with {settings.name}</Text>
            <Text style={styles.emptySubtitle}>
              Your AI companion is here for emotional connection and conversation
            </Text>

            {!apiKey && (
              <View style={styles.apiKeyWarning}>
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.highlight} />
                <Text style={styles.apiKeyWarningText}>
                  Please set your OpenAI API key in Settings to start chatting
                </Text>
                <TouchableOpacity 
                  style={styles.goToSettingsButton}
                  onPress={() => router.push('/(tabs)/settings')}
                >
                  <Text style={styles.goToSettingsButtonText}>Go to Settings</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
              <TouchableOpacity
                style={[styles.quickActionButton, (isSending) && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('date')}
                disabled={isSending || !apiKey}
              >
                <IconSymbol name="heart.fill" size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Date Idea</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, (isSending) && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('flirty')}
                disabled={isSending || !apiKey}
              >
                <IconSymbol name="sparkles" size={20} color={colors.secondary} />
                <Text style={styles.quickActionText}>Flirty Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, (isSending) && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('feelings')}
                disabled={isSending || !apiKey}
              >
                <IconSymbol name="bubble.left.and.bubble.right.fill" size={20} color={colors.accent} />
                <Text style={styles.quickActionText}>Express Feelings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                ⚠️ This is a fictional AI companion, not a real person. Responses are generated by AI.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message ${settings.name}...`}
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              editable={!isSending}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSendPress}
              enablesReturnKeyAutomatically={true}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendPress}
              disabled={!inputText.trim() || isSending}
              activeOpacity={0.7}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={[
                  styles.sendButtonCircle,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}>
                  <IconSymbol
                    name="arrow.up"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  emptyScrollView: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 200,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: colors.accent,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  apiKeyWarning: {
    backgroundColor: colors.highlight + '20',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.highlight + '40',
  },
  apiKeyWarningText: {
    fontSize: 14,
    color: colors.highlight,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  goToSettingsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  goToSettingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  quickActionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  quickActionButtonDisabled: {
    opacity: 0.5,
  },
  quickActionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  disclaimerContainer: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 80,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.accent + '40',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.textSecondary,
  },
});
