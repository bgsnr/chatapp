# Chat App with Firebase - Setup Guide

## Overview

Chat App adalah aplikasi chat real-time yang dibangun dengan React Native/Expo dan Firebase. Aplikasi ini memungkinkan pengguna untuk:

- Mendaftar dan login dengan email/password
- Membuat dan mengelola percakapan chat
- Mengirim dan menerima pesan secara real-time
- Mengelola profil pengguna
- Melihat status online/offline pengguna

## Architecture

### Folder Structure

```
chatapp/
├── app/                          # Routing dan entry points
│   ├── _layout.tsx              # Root layout dengan providers
│   ├── chat.tsx                 # Chat screen route
│   └── profile.tsx              # Profile screen route
├── components/                   # Reusable UI components
│   ├── Button.tsx               # Button component
│   └── TextInputField.tsx        # Text input component
├── context/                      # React context untuk state management
│   ├── AuthContext.tsx          # Authentication context
│   └── ChatContext.tsx          # Chat state context
├── services/                     # Business logic dan Firebase operations
│   ├── firebase.ts              # Firebase initialization
│   ├── auth.ts                  # Authentication service
│   └── chat.ts                  # Chat service
├── screens/                      # Screen components
│   ├── AuthEntryScreen.tsx      # Login/Register entry
│   ├── LoginScreen.tsx          # Login page
│   ├── RegisterScreen.tsx       # Register page
│   ├── ChatMainScreen.tsx       # Main chat screen
│   ├── ChatListScreen.tsx       # Chat list
│   ├── ChatDetailScreen.tsx     # Chat detail/messages
│   └── ProfileScreen.tsx        # User profile
├── types/                        # TypeScript interfaces
│   └── index.ts                 # Type definitions
└── constants/                    # Konstanta aplikasi
    └── theme.ts                 # Theme colors
```

## Firebase Setup

### 1. Create Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Ikuti langkah-langkah pembuatan project

### 2. Setup Authentication

1. Di Firebase Console, buka "Authentication"
2. Klik "Get Started"
3. Pilih "Email/Password" sebagai authentication method
4. Enable "Email/Password" authentication

### 3. Setup Firestore Database

1. Di Firebase Console, buka "Firestore Database"
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi region yang sesuai

### 4. Database Structure

Firestore akan memiliki struktur berikut:

```
/users (collection)
  /{userId} (document)
    ├── id: string
    ├── email: string
    ├── name: string
    ├── avatar: string (optional)
    ├── createdAt: Timestamp
    ├── status: 'online' | 'offline'
    └── lastSeen: Timestamp

/chats (collection)
  /{chatId} (document)
    ├── id: string
    ├── participants: string[] (user IDs)
    ├── participantNames: string[]
    ├── lastMessage: string
    ├── lastMessageTime: Timestamp
    ├── lastMessageSender: string
    ├── createdAt: Timestamp
    └── updatedAt: Timestamp
    
/chats/{chatId}/messages (subcollection)
  /{messageId} (document)
    ├── id: string
    ├── chatId: string
    ├── senderId: string
    ├── senderName: string
    ├── senderAvatar: string (optional)
    ├── text: string
    ├── createdAt: Timestamp
    ├── updatedAt: Timestamp
    └── isEdited: boolean
```

### 5. Get Firebase Config

1. Di Firebase Console, buka "Project Settings"
2. Klik "Your apps" atau "Add app"
3. Pilih platform "Web"
4. Copy Firebase config

### 6. Environment Variables

1. Rename `.env.example` menjadi `.env.local`
2. Isi dengan Firebase config:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

atau jika menggunakan yarn:

```bash
yarn install
```

### 2. Environment Setup

Copy `.env.example` ke `.env.local` dan isi dengan Firebase credentials.

### 3. Run Application

```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web

# For development
npm start
```

## Key Features

### Authentication (AuthContext & AuthService)

- **Register**: Buat akun baru dengan email dan password
- **Login**: Masuk dengan email dan password yang sudah terdaftar
- **Logout**: Keluar dari akun
- **Profile Update**: Update nama dan avatar pengguna
- **Session Persistence**: Session disimpan otomatis dengan AsyncStorage

### Chat (ChatContext & ChatService)

- **Real-time Chat**: Pesan update secara real-time dengan Firestore listeners
- **One-to-One Messaging**: Chat individual dengan pengguna lain
- **Message History**: Melihat riwayat pesan yang sudah dikirim
- **Message Operations**:
  - Send message
  - Edit message
  - Delete message
- **Chat Management**:
  - Create new chat
  - Delete chat
  - View chat list

### UI Components

1. **TextInputField**: Reusable input field dengan error handling
2. **Button**: Customizable button dengan loading state

## API Services

### AuthService Methods

```typescript
// Register new user
AuthService.register(email, password, name): Promise<User>

// Login user
AuthService.login(email, password): Promise<User>

// Get current logged-in user
AuthService.getCurrentUser(): Promise<User | null>

// Logout user
AuthService.logout(): Promise<void>

// Update user profile
AuthService.updateProfile(userId, name, avatar?): Promise<void>

// Get user by ID
AuthService.getUserById(userId): Promise<User | null>
```

### ChatService Methods

```typescript
// Get all chats for current user
ChatService.getChats(): Promise<Chat[]>

// Listen to chats in real-time
ChatService.listenToChats(callback): () => void

// Create new chat with participant
ChatService.createChat(participantId, participantName): Promise<Chat>

// Get messages for a chat
ChatService.getMessages(chatId): Promise<Message[]>

// Listen to messages in real-time
ChatService.listenToMessages(chatId, callback): () => void

// Send a message
ChatService.sendMessage(chatId, text, senderName, senderAvatar?): Promise<Message>

// Delete a message
ChatService.deleteMessage(chatId, messageId): Promise<void>

// Delete a chat
ChatService.deleteChat(chatId): Promise<void>

// Edit a message
ChatService.editMessage(chatId, messageId, newText): Promise<void>

// Get participant info
ChatService.getParticipantInfo(userId): Promise<{ id: string; name: string }>
```

## Context Hooks

### useAuth Hook

```typescript
const {
  user,           // Current logged-in user or null
  loading,        // Loading state
  login,          // Function to login
  register,       // Function to register
  logout,         // Function to logout
  updateProfile,  // Function to update profile
} = useAuth();
```

### useChat Hook

```typescript
const {
  chats,          // Array of user's chats
  currentChat,    // Currently selected chat
  messages,       // Messages in current chat
  loading,        // Loading state
  error,          // Error message if any
  loadChats,      // Function to load chats
  loadMessages,   // Function to load messages for a chat
  sendMessage,    // Function to send a message
  createChat,     // Function to create new chat
  deleteChat,     // Function to delete a chat
  setCurrentChat, // Function to set current chat
} = useChat();
```

## Screen Components

### AuthEntryScreen
- Entry point untuk authentication
- Toggle antara login dan register

### LoginScreen
- Email dan password input
- Form validation
- Error handling
- Link ke register screen

### RegisterScreen
- Name, email, password input
- Password confirmation
- Form validation
- Link ke login screen

### ChatMainScreen
- Main container untuk chat functionality
- Toggle antara chat list dan chat detail

### ChatListScreen
- Menampilkan list semua chat
- Nama participant dan pesan terakhir
- Waktu pesan terakhir
- Long press untuk delete chat

### ChatDetailScreen
- Menampilkan pesan-pesan dalam chat
- Input field untuk mengirim pesan
- Real-time message updates
- Back button untuk kembali ke list

### ProfileScreen
- Menampilkan informasi pengguna
- Edit profile (name)
- Logout button
- Status indicator

## Development Tips

### Testing Firebase Connection

1. Buka app dan register akun baru
2. Check Firestore untuk memastikan user document tercreate
3. Login dengan credentials yang baru
4. Kirim pesan untuk test chat functionality

### Debugging

- Use `console.log()` untuk debug
- Open React Native debugger untuk inspect state
- Check Firebase Console untuk memastikan data tersimpan dengan benar

### Common Issues

1. **Firebase not initialized**: Pastikan `.env.local` dengan config yang benar
2. **Pesan tidak terkirim**: Check Firestore security rules dan permissions
3. **Auth tidak berfungsi**: Pastikan Email/Password authentication enabled di Firebase

## Production Deployment

1. Update `.env.local` dengan production Firebase config
2. Update security rules di Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Chats collection - users can read their chats
    match /chats/{chatId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow write: if request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{message} {
        allow read: if request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow write: if request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }
  }
}
```

3. Build dan deploy ke app store/play store

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development framework
- **Firebase**: Backend as a Service
  - Authentication
  - Firestore Database
  - Real-time listeners
- **React Context**: State management
- **TypeScript**: Type safety
- **Expo Router**: Navigation
- **AsyncStorage**: Local persistence

## License

This project is open source and available under the MIT License.

## Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.
