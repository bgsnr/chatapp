import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ChatService } from '../services/chat';
import { Chat, ChatContextType, Message } from '../types';
import { useAuth } from './AuthContext';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Subscribe to chats when user is logged in
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    try {
      const unsubscribe = ChatService.listenToChats((updatedChats) => {
        setChats(updatedChats);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  // Subscribe to messages when currentChat changes
  useEffect(() => {
    if (!currentChat) return;

    setLoading(true);
    try {
      const unsubscribe = ChatService.listenToMessages(currentChat.id, (updatedMessages) => {
        setMessages(updatedMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [currentChat]);

  const loadChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedChats = await ChatService.getChats();
      setChats(fetchedChats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMessages = useCallback(async (chatId: string) => {
    setLoading(true);
    try {
      const fetchedMessages = await ChatService.getMessages(chatId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      if (!user) throw new Error('No user logged in');
      try {
        await ChatService.sendMessage(chatId, text, user.name, user.avatar);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  const createChat = useCallback(async (participantId: string) => {
    try {
      // Get participant name from Firestore
      const participantUser = await ChatService.getParticipantInfo(participantId);
      const chat = await ChatService.createChat(participantId, participantUser.name);
      setError(null);
      return chat;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await ChatService.deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [currentChat]);

  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    loading,
    error,
    loadChats,
    loadMessages,
    sendMessage,
    createChat,
    deleteChat,
    setCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
