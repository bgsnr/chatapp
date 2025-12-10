import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Chat } from '@/types';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatListScreenProps {
  onSelectChat: (chat: Chat) => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({ onSelectChat }) => {
  const { chats, loading, error } = useChat();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleChatPress = (chat: Chat) => {
    onSelectChat(chat);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            // Implement delete functionality
            // await deleteChat(chatId);
          } catch {
            Alert.alert('Error', 'Failed to delete chat');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherParticipantIndex = item.participants[0] === user?.id ? 1 : 0;
    const otherParticipantName = item.participantNames[otherParticipantIndex];
    const timeString = item.lastMessageTime
      ? new Date(item.lastMessageTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          {
            backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
            borderBottomColor: isDarkMode ? Colors.dark.tabIconDefault : '#e0e0e0',
          },
        ]}
        onPress={() => handleChatPress(item)}
        onLongPress={() => handleDeleteChat(item.id)}
      >
        <View style={styles.chatContent}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.participantName,
                { color: isDarkMode ? Colors.dark.text : Colors.light.text },
              ]}
              numberOfLines={1}
            >
              {otherParticipantName || 'Unknown'}
            </Text>
            <Text
              style={[
                styles.timeText,
                { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
              ]}
            >
              {timeString}
            </Text>
          </View>
          <Text
            style={[
              styles.lastMessage,
              { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
            ]}
            numberOfLines={2}
          >
            {item.lastMessage || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && chats.length === 0) {
    return (
      <View style={[
        styles.centerContainer,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[
        styles.centerContainer,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}>
        <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}
    >
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
            ]}
          >
            No chats yet
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
            ]}
          >
            Start a new conversation to begin messaging
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chatContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
