
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
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, addMessage, clearMessages } = useChatMessages();
  const { settings } = useCompanionSettings();
  const { generateResponse, loading } = useOpenAI();
  const { apiKey } = useApiKey();

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    if (!apiKey) {
      Alert.alert(
        'API Key Required',
        'Please set your OpenAI API key in the Settings tab to use the chat feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    // Build conversation history for context
    const conversationHistory = messages.slice(-10).map((msg) => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    const systemPrompt = PERSONALITY_SYSTEM_PROMPTS[settings.personality];
    const fullPrompt = `${systemPrompt}\n\nYour name is ${settings.name}. Keep responses concise and engaging (2-3 sentences max). Show personality through your responses.`;

    const aiResponse = await generateResponse(
      [
        { role: 'system', content: fullPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage.text },
      ],
      apiKey
    );

    setIsTyping(false);

    if (aiResponse) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      addMessage(aiMessage);
    } else {
      Alert.alert(
        'Error',
        'Failed to get response from AI. Please check your API key and try again.',
        [{ text: 'OK' }]
      );
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
          onPress: clearMessages,
        },
      ]
    );
  };

  const handleQuickAction = (action: string) => {
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
    }
    setInputText(prompt);
  };

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={{ uri: settings.avatar }} style={styles.largeAvatar} />
            <Text style={styles.emptyTitle}>Start chatting with {settings.name}</Text>
            <Text style={styles.emptySubtitle}>
              Your AI companion is here for emotional connection and conversation
            </Text>

            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction('date')}
              >
                <IconSymbol name="heart.fill" size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Date Idea</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction('flirty')}
              >
                <IconSymbol name="sparkles" size={20} color={colors.secondary} />
                <Text style={styles.quickActionText}>Flirty Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction('feelings')}
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
          </View>
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
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <IconSymbol
                name="arrow.up.circle.fill"
                size={32}
                color={inputText.trim() && !loading ? colors.primary : colors.textSecondary}
              />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 32,
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
    paddingBottom: Platform.OS === 'android' ? 100 : 16,
  },
  inputContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'android' ? 90 : 12,
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
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
