import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { Chat, Message } from '../types';
import { auth, db } from './firebase';

export class ChatService {
  // Get all chats for current user
  static async getChats(): Promise<Chat[]> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const chats: Chat[] = [];

      querySnapshot.forEach((doc) => {
        const chatData = doc.data() as Chat;
        chats.push({
          ...chatData,
          createdAt: chatData.createdAt instanceof Timestamp 
            ? chatData.createdAt.toDate() 
            : new Date(chatData.createdAt),
          updatedAt: chatData.updatedAt instanceof Timestamp 
            ? chatData.updatedAt.toDate() 
            : new Date(chatData.updatedAt),
          lastMessageTime: chatData.lastMessageTime instanceof Timestamp 
            ? chatData.lastMessageTime.toDate() 
            : new Date(chatData.lastMessageTime || new Date()),
        });
      });

      return chats;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chats');
    }
  }

  // Listen to chats in real-time
  static listenToChats(callback: (chats: Chat[]) => void): () => void {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats: Chat[] = [];
        querySnapshot.forEach((doc) => {
          const chatData = doc.data() as Chat;
          chats.push({
            ...chatData,
            id: doc.id,
            createdAt: chatData.createdAt instanceof Timestamp 
              ? chatData.createdAt.toDate() 
              : new Date(chatData.createdAt),
            updatedAt: chatData.updatedAt instanceof Timestamp 
              ? chatData.updatedAt.toDate() 
              : new Date(chatData.updatedAt),
            lastMessageTime: chatData.lastMessageTime instanceof Timestamp 
              ? chatData.lastMessageTime.toDate() 
              : new Date(chatData.lastMessageTime || new Date()),
          });
        });
        callback(chats);
      });

      return unsubscribe;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to listen to chats');
    }
  }

  // Create a new chat
  static async createChat(participantId: string, participantName: string): Promise<Chat> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      // Check if chat already exists
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
      );

      const querySnapshot = await getDocs(q);
      let existingChat: Chat | undefined;

      querySnapshot.forEach((doc) => {
        const chatData = doc.data() as Chat;
        if (chatData.participants.includes(participantId)) {
          existingChat = { ...chatData, id: doc.id };
        }
      });

      if (existingChat) {
        return existingChat;
      }

      // Create new chat
      const chatData = {
        participants: [userId, participantId],
        participantNames: ['', participantName],
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);

      return {
        id: docRef.id,
        ...chatData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create chat');
    }
  }

  // Get messages for a chat
  static async getMessages(chatId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        messages.push({
          ...messageData,
          id: doc.id,
          createdAt: messageData.createdAt instanceof Timestamp 
            ? messageData.createdAt.toDate() 
            : new Date(messageData.createdAt),
          updatedAt: messageData.updatedAt instanceof Timestamp 
            ? messageData.updatedAt.toDate() 
            : new Date(messageData.updatedAt || messageData.createdAt),
        });
      });

      return messages;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch messages');
    }
  }

  // Listen to messages in real-time
  static listenToMessages(chatId: string, callback: (messages: Message[]) => void): () => void {
    try {
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data() as Message;
          messages.push({
            ...messageData,
            id: doc.id,
            createdAt: messageData.createdAt instanceof Timestamp 
              ? messageData.createdAt.toDate() 
              : new Date(messageData.createdAt),
            updatedAt: messageData.updatedAt instanceof Timestamp 
              ? messageData.updatedAt.toDate() 
              : new Date(messageData.updatedAt || messageData.createdAt),
          });
        });
        callback(messages);
      });

      return unsubscribe;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to listen to messages');
    }
  }

  // Send a message
  static async sendMessage(
    chatId: string,
    text: string,
    senderName: string,
    senderAvatar?: string
  ): Promise<Message> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const messageData = {
        senderId: userId,
        senderName: senderName,
        senderAvatar: senderAvatar || '',
        text: text,
        createdAt: Timestamp.fromDate(new Date()),
        isEdited: false,
      };

      const docRef = await addDoc(
        collection(db, 'chats', chatId, 'messages'),
        messageData
      );

      // Update chat with last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        lastMessageTime: Timestamp.fromDate(new Date()),
        lastMessageSender: userId,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      return {
        id: docRef.id,
        chatId: chatId,
        ...messageData,
        createdAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send message');
    }
  }

  // Delete a message
  static async deleteMessage(chatId: string, messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete message');
    }
  }

  // Delete a chat
  static async deleteChat(chatId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'chats', chatId));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete chat');
    }
  }

  // Edit a message
  static async editMessage(
    chatId: string,
    messageId: string,
    newText: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
        text: newText,
        updatedAt: Timestamp.fromDate(new Date()),
        isEdited: true,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to edit message');
    }
  }

  // Get participant info
  static async getParticipantInfo(userId: string): Promise<{ id: string; name: string }> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userId,
          name: userData.name || 'Unknown',
        };
      }
      return { id: userId, name: 'Unknown' };
    } catch {
      return { id: userId, name: 'Unknown' };
    }
  }
}
