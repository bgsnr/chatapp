import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Message } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatDetailScreenProps {
  chatId: string;
  onBack: () => void;
}

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ chatId, onBack }) => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const { messages, loading, sendMessage } = useChat();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      await sendMessage(chatId, text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handling
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === user?.id;
    const messageDate = new Date(item.createdAt);
    const timeString = messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentContainer : styles.receivedContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser
              ? { backgroundColor: Colors.light.tint }
              : {
                  backgroundColor: isDarkMode
                    ? Colors.dark.tabIconDefault
                    : Colors.light.tabIconDefault,
                },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isCurrentUser ? 'white' : isDarkMode ? Colors.dark.text : '#000',
              },
            ]}
          >
            {item.text}
          </Text>
          {item.isEdited && (
            <Text
              style={[
                styles.editedText,
                {
                  color: isCurrentUser ? 'rgba(255,255,255,0.7)' : isDarkMode ? Colors.dark.tabIconDefault : '#666',
                },
              ]}
            >
              (edited)
            </Text>
          )}
        </View>
        <Text style={styles.timeText}>{timeString}</Text>
      </View>
    );
  };

  if (loading && messages.length === 0) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
        ]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? Colors.dark.text : Colors.light.text}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
        >
          Chat
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
            ]}
          >
            No messages yet
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
            ]}
          >
            Start the conversation by sending a message
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderTopColor: isDarkMode ? Colors.dark.tabIconDefault : '#e0e0e0',
          },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDarkMode ? Colors.dark.tabIconDefault : '#f0f0f0',
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
              maxHeight: 100,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          editable={!sending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: !messageText.trim() || sending ? 0.5 : 1 },
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  editedText: {
    fontSize: 12,
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginHorizontal: 8,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
