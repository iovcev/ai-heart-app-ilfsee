
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

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

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
      const aiResponse = await generateResponse([
        { role: 'system', content: fullPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage.text },
      ]);

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
          aiError || 'Failed to get response from AI. Please try again.',
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

  if (messagesLoading || settingsLoading) {
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
              <Image source={{ uri: settings.avatar }} style={styles.headerAvatar} />
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

            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
              <TouchableOpacity
                style={[styles.quickActionButton, isSending && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('date')}
                disabled={isSending}
              >
                <IconSymbol name="heart.fill" size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Date Idea</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, isSending && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('flirty')}
                disabled={isSending}
              >
                <IconSymbol name="sparkles" size={20} color={colors.secondary} />
                <Text style={styles.quickActionText}>Flirty Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, isSending && styles.quickActionButtonDisabled]}
                onPress={() => handleQuickAction('feelings')}
                disabled={isSending}
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
              <MessageBubble 
                key={message.id} 
                message={message}
                avatar={message.sender === 'ai' ? settings.avatar : undefined}
              />
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
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    width: 180,
    height: 180,
    borderRadius: 90,
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
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 180,
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
