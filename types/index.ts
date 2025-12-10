export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  status?: 'online' | 'offline';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  participants: string[]; // user IDs
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  lastMessageSender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, avatar?: string) => Promise<void>;
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  createChat: (participantId: string) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  setCurrentChat: (chat: Chat) => void;
}
