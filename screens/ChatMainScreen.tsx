import { Chat } from '@/types';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatDetailScreen } from './ChatDetailScreen';
import { ChatListScreen } from './ChatListScreen';

export const ChatMainScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  if (selectedChat) {
    return (
      <ChatDetailScreen
        chatId={selectedChat.id}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ChatListScreen onSelectChat={setSelectedChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
