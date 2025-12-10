import { Chat } from '@/types';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatDetailScreen } from './ChatDetailScreen';
import { ChatListScreen } from './ChatListScreen';
import { NewChatScreen } from './NewChatScreen';

export const ChatMainScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  if (selectedChat) {
    return (
      <ChatDetailScreen
        chatId={selectedChat.id}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  if (showNewChat) {
    return (
      <NewChatScreen
        onChatCreated={() => {
          setShowNewChat(false);
        }}
        onClose={() => setShowNewChat(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ChatListScreen 
        onSelectChat={setSelectedChat}
        onNewChatPress={() => setShowNewChat(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
