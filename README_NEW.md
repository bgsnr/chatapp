# Chat App - Real-time Messaging with Firebase

A modern, real-time chat application built with React Native, Expo, and Firebase. Features authentication, one-to-one messaging, user profiles, and real-time message synchronization.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ dengan npm/yarn
- Firebase project (free)
- Expo CLI: `npm install -g expo-cli`
- iOS/Android emulator atau physical device

### Installation (5 minutes)

```bash
# 1. Clone dan setup
git clone <repository-url>
cd chatapp
npm install

# 2. Configure Firebase
cp .env.example .env.local
# Edit .env.local dengan Firebase credentials Anda

# 3. Start development server
npm start

# 4. Choose platform
# Press 'i' untuk iOS, 'a' untuk Android, 'w' untuk Web
```

Lihat **[QUICKSTART.md](./QUICKSTART.md)** untuk setup lengkap.

## ✨ Features

- ✅ **User Authentication**
  - Register dengan email & password
  - Login/Logout
  - Session persistence

- ✅ **Real-time Messaging**
  - Send/receive messages instantly
  - Message history
  - Real-time updates across devices
  - Edit & delete messages

- ✅ **User Management**
  - User profiles
  - Search users
  - User status (online/offline)

- ✅ **Modern UI**
  - Dark mode support
  - Responsive design
  - Intuitive navigation
  - Loading states & error handling

## 📱 Screenshots

```
Login Screen → Chat List → Chat Detail → Profile
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **State**: React Context API
- **Backend**: Firebase (Auth + Firestore)
- **Storage**: AsyncStorage

### Folder Structure
```
app/              → Routing & entry points
services/         → Firebase operations
context/          → State management
screens/          → Screen components
components/       → Reusable UI components
types/            → TypeScript definitions
constants/        → App constants
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create Project"
3. Fill project details dan create

### 2. Enable Services
1. **Authentication**: Enable Email/Password auth
2. **Firestore**: Create Database in test mode
3. **Get Config**: Project Settings > Web App

### 3. Security Rules
```
Copy firestore.rules content to Firestore Rules
(See documentation untuk production rules)
```

### 4. Environment Variables
```
# .env.local
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5 minute setup guide
- **[CHATAPP_GUIDE.md](./CHATAPP_GUIDE.md)** - Complete documentation
- **[API_REFERENCE.md](./API_REFERENCE.md)** - API & service documentation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing scenarios & checklist
- **[FIRESTORE_INDEXES.md](./FIRESTORE_INDEXES.md)** - Firestore optimization

## 🎯 Usage Examples

### Login
```typescript
import { useAuth } from '@/context/AuthContext';

const { login } = useAuth();

await login('user@example.com', 'password123');
```

### Send Message
```typescript
import { useChat } from '@/context/ChatContext';

const { sendMessage } = useChat();

await sendMessage(chatId, 'Hello, World!');
```

### Listen to Messages
```typescript
const { messages } = useChat();

<FlatList
  data={messages}
  renderItem={({ item }) => <MessageBubble message={item} />}
/>
```

Lihat [API_REFERENCE.md](./API_REFERENCE.md) untuk documentation lengkap.

## 🧪 Testing

Manual testing scenarios tersedia di [TESTING_GUIDE.md](./TESTING_GUIDE.md).

### Test Scenarios
1. Register & login
2. Send messages
3. Real-time updates
4. Profile management
5. Error handling
6. Dark mode
7. Performance

## 🚀 Deployment

### Build untuk iOS
```bash
eas build --platform ios
# Atau local build
xcode-select --install
```

### Build untuk Android
```bash
eas build --platform android
# Atau local build
npx react-native run-android --variant release
```

### Web
```bash
npm run web
# Deploy to Firebase Hosting atau service lain
```

## 🛡️ Security

- Firebase Authentication untuk user security
- Firestore security rules untuk data access control
- AsyncStorage untuk local persistence
- Environment variables untuk credentials

Lihat [CHATAPP_GUIDE.md](./CHATAPP_GUIDE.md) untuk security best practices.

## 📊 Performance

- Optimized Firestore queries
- Real-time listeners untuk instant updates
- Message pagination ready
- Lazy loading support

Lihat [FIRESTORE_INDEXES.md](./FIRESTORE_INDEXES.md) untuk optimization tips.

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature/name`
5. Submit Pull Request

## 📝 Available Scripts

```bash
# Development
npm start          # Start development server
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run on Web

# Code quality
npm run lint       # Lint code

# Building
npm run build      # Build for deployment
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Firebase not initialized | Check .env.local dan credentials |
| Permission denied | Verify Firestore security rules |
| Messages don't appear | Check Firestore console untuk data |
| Real-time not working | Verify listener subscription |
| App crashes | Check console logs untuk errors |

Lihat [TESTING_GUIDE.md](./TESTING_GUIDE.md) untuk troubleshooting lengkap.

## 🗓️ Roadmap

- [ ] Group chats
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File sharing
- [ ] Push notifications
- [ ] Message search
- [ ] Voice messages
- [ ] Video calls

## 📖 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - feel free to use this project sebagai starting point

## 🤝 Support

Untuk questions atau issues:
1. Lihat documentation files
2. Check troubleshooting guides
3. Create GitHub issue dengan detail

---

**Made with ❤️ for real-time communication**

**Last Updated**: December 2024  
**Version**: 1.0.0
