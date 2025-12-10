# API Reference

## AuthContext API

### useAuth()

Hook untuk mengakses authentication state dan methods.

```typescript
const {
  user,              // User | null - current logged-in user
  loading,           // boolean - loading state
  login,             // (email, password) => Promise<void>
  register,          // (email, password, name) => Promise<void>
  logout,            // () => Promise<void>
  updateProfile      // (name, avatar?) => Promise<void>
} = useAuth();
```

### Methods

#### login(email, password)
```typescript
try {
  await login('user@example.com', 'password123');
  // User is now authenticated
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### register(email, password, name)
```typescript
try {
  await register('newuser@example.com', 'password123', 'John Doe');
  // User is now registered and authenticated
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### logout()
```typescript
try {
  await logout();
  // User is logged out and user state is cleared
} catch (error) {
  console.error('Logout failed:', error.message);
}
```

#### updateProfile(name, avatar?)
```typescript
try {
  await updateProfile('New Name', 'https://...');
  // User profile is updated
} catch (error) {
  console.error('Update failed:', error.message);
}
```

---

## ChatContext API

### useChat()

Hook untuk mengakses chat state dan methods.

```typescript
const {
  chats,             // Chat[] - list of user's chats
  currentChat,       // Chat | null - currently selected chat
  messages,          // Message[] - messages in current chat
  loading,           // boolean - loading state
  error,             // string | null - error message
  loadChats,         // () => Promise<void>
  loadMessages,      // (chatId) => Promise<void>
  sendMessage,       // (chatId, text) => Promise<void>
  createChat,        // (participantId) => Promise<Chat>
  deleteChat,        // (chatId) => Promise<void>
  setCurrentChat     // (chat) => void
} = useChat();
```

### Methods

#### loadChats()
```typescript
try {
  await loadChats();
  // chats state is updated
} catch (error) {
  console.error('Failed to load chats:', error.message);
}
```

#### loadMessages(chatId)
```typescript
try {
  await loadMessages('chat-id-123');
  // messages state is updated with chat messages
} catch (error) {
  console.error('Failed to load messages:', error.message);
}
```

#### sendMessage(chatId, text)
```typescript
try {
  await sendMessage('chat-id-123', 'Hello, World!');
  // Message is sent and messages state is updated
} catch (error) {
  console.error('Failed to send message:', error.message);
}
```

#### createChat(participantId)
```typescript
try {
  const chat = await createChat('user-id-456');
  // New chat is created
  setCurrentChat(chat);
} catch (error) {
  console.error('Failed to create chat:', error.message);
}
```

#### deleteChat(chatId)
```typescript
try {
  await deleteChat('chat-id-123');
  // Chat is deleted, chats state is updated
} catch (error) {
  console.error('Failed to delete chat:', error.message);
}
```

#### setCurrentChat(chat)
```typescript
setCurrentChat(chat);
// currentChat state is updated
```

---

## AuthService API

### register(email, password, name) → Promise<User>

Registers a new user dengan email dan password.

**Parameters**:
- `email: string` - User email
- `password: string` - User password (min 6 chars)
- `name: string` - User display name

**Returns**: User object

```typescript
const user = await AuthService.register(
  'user@example.com',
  'password123',
  'John Doe'
);
```

### login(email, password) → Promise<User>

Logs in a user dengan email dan password.

**Parameters**:
- `email: string` - User email
- `password: string` - User password

**Returns**: User object

```typescript
const user = await AuthService.login('user@example.com', 'password123');
```

### logout() → Promise<void>

Logs out the current user.

```typescript
await AuthService.logout();
```

### getCurrentUser() → Promise<User | null>

Gets the current authenticated user.

```typescript
const user = await AuthService.getCurrentUser();
```

### updateProfile(userId, name, avatar?) → Promise<void>

Updates user profile.

**Parameters**:
- `userId: string` - User ID
- `name: string` - New display name
- `avatar?: string` - New avatar URL (optional)

```typescript
await AuthService.updateProfile('user-id-123', 'New Name', 'https://...');
```

### getUserById(userId) → Promise<User | null>

Gets user info by ID.

**Parameters**:
- `userId: string` - User ID

```typescript
const user = await AuthService.getUserById('user-id-123');
```

---

## ChatService API

### getChats() → Promise<Chat[]>

Gets all chats for current user.

```typescript
const chats = await ChatService.getChats();
```

### listenToChats(callback) → () => void

Listens to real-time updates untuk user's chats.

**Parameters**:
- `callback: (chats: Chat[]) => void` - Called when chats update

**Returns**: Unsubscribe function

```typescript
const unsubscribe = ChatService.listenToChats((chats) => {
  console.log('Chats updated:', chats);
});

// Later, unsubscribe
unsubscribe();
```

### createChat(participantId, participantName) → Promise<Chat>

Creates atau gets existing chat dengan user lain.

**Parameters**:
- `participantId: string` - Other user's ID
- `participantName: string` - Other user's name

**Returns**: Chat object

```typescript
const chat = await ChatService.createChat('user-id-456', 'Jane Doe');
```

### getMessages(chatId) → Promise<Message[]>

Gets all messages dalam chat.

**Parameters**:
- `chatId: string` - Chat ID

```typescript
const messages = await ChatService.getMessages('chat-id-123');
```

### listenToMessages(chatId, callback) → () => void

Listens to real-time message updates.

**Parameters**:
- `chatId: string` - Chat ID
- `callback: (messages: Message[]) => void` - Called when messages update

**Returns**: Unsubscribe function

```typescript
const unsubscribe = ChatService.listenToMessages('chat-id-123', (messages) => {
  console.log('Messages updated:', messages);
});

// Later, unsubscribe
unsubscribe();
```

### sendMessage(chatId, text, senderName, senderAvatar?) → Promise<Message>

Sends a message.

**Parameters**:
- `chatId: string` - Chat ID
- `text: string` - Message text
- `senderName: string` - Sender's display name
- `senderAvatar?: string` - Sender's avatar URL (optional)

**Returns**: Message object

```typescript
const message = await ChatService.sendMessage(
  'chat-id-123',
  'Hello!',
  'John Doe'
);
```

### editMessage(chatId, messageId, newText) → Promise<void>

Edits a message.

**Parameters**:
- `chatId: string` - Chat ID
- `messageId: string` - Message ID
- `newText: string` - New message text

```typescript
await ChatService.editMessage('chat-id-123', 'msg-id-456', 'Updated text');
```

### deleteMessage(chatId, messageId) → Promise<void>

Deletes a message.

**Parameters**:
- `chatId: string` - Chat ID
- `messageId: string` - Message ID

```typescript
await ChatService.deleteMessage('chat-id-123', 'msg-id-456');
```

### deleteChat(chatId) → Promise<void>

Deletes a chat.

**Parameters**:
- `chatId: string` - Chat ID

```typescript
await ChatService.deleteChat('chat-id-123');
```

### getParticipantInfo(userId) → Promise<{ id: string; name: string }>

Gets participant info.

**Parameters**:
- `userId: string` - User ID

**Returns**: Object dengan id dan name

```typescript
const info = await ChatService.getParticipantInfo('user-id-123');
```

---

## Type Definitions

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  status?: 'online' | 'offline';
  lastSeen?: Date;
}
```

### Chat
```typescript
interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  lastMessageSender?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Message
```typescript
interface Message {
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
```

---

## Error Handling

Semua API dapat throw errors. Selalu wrap dalam try-catch:

```typescript
try {
  await someAsyncOperation();
} catch (error: any) {
  const errorMessage = error.message || 'Unknown error';
  console.error('Operation failed:', errorMessage);
  
  // Handle specific errors
  if (errorMessage.includes('auth')) {
    // Authentication error
  } else if (errorMessage.includes('Permission')) {
    // Permission error
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `"User not authenticated"` | No logged-in user | Call login() first |
| `"Permission denied"` | Firestore rules block access | Check security rules |
| `"Firebase not configured"` | Missing .env.local | Create .env.local dengan credentials |
| `"Invalid email format"` | Email validation failed | Provide valid email |
| `"Password must be at least 6 characters"` | Password too short | Use longer password |

---

## Usage Examples

### Complete Login Flow
```typescript
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

function LoginComponent() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation happens automatically in RootLayout
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button onPress={handleLogin} title={loading ? 'Loading...' : 'Login'} disabled={loading} />
    </>
  );
}
```

### Complete Chat Flow
```typescript
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';

function ChatComponent() {
  const { messages, sendMessage, currentChat } = useChat();
  const { user } = useAuth();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!currentChat || !text.trim()) return;
    
    try {
      await sendMessage(currentChat.id, text);
      setText('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View>
            <Text>{item.senderName}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput value={text} onChangeText={setText} placeholder="Message..." />
      <Button onPress={handleSend} title="Send" />
    </>
  );
}
```

---

**Last Updated**: December 2024
