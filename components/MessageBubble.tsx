
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Message } from '@/types/chat';

type MessageBubbleProps = {
  message: Message;
  avatar?: string;
};

export default function MessageBubble({ message, avatar }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
      {!isUser && avatar && (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      )}
      <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
            {message.text}
          </Text>
        </View>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
      {isUser && <View style={styles.avatarPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    marginTop: 4,
    backgroundColor: colors.accent,
  },
  avatarPlaceholder: {
    width: 48,
    marginLeft: 10,
  },
  container: {
    maxWidth: '70%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  userTimestamp: {
    color: colors.textSecondary,
  },
  aiTimestamp: {
    color: colors.textSecondary,
  },
});
