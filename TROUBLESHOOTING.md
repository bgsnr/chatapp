# Troubleshooting Guide

## Installation Issues

### 1. npm install fails
**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Use legacy dependency resolution
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
```

### 2. Expo CLI not found
**Error**: `command not found: expo`

**Solution**:
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Or use npx
npx expo start
```

### 3. Port already in use
**Error**: `Port 8081 is already in use`

**Solution**:
```bash
# Kill process using port
lsof -ti:8081 | xargs kill -9

# Or use different port
expo start --port 8082
```

---

## Firebase Configuration Issues

### 1. Firebase not initialized
**Error**: `Firebase not configured` atau `undefined is not an object`

**Solution**:
1. Create `.env.local` file
2. Copy content dari `.env.example`
3. Fill dengan Firebase credentials
4. Restart expo server

**Check**:
- [ ] .env.local file exists
- [ ] All EXPO_PUBLIC_FIREBASE_* variables filled
- [ ] No extra spaces atau quotes
- [ ] Firebase project created
- [ ] Credentials copied correctly

### 2. Wrong Firebase credentials
**Error**: Firestore queries fail, authentication doesn't work

**Solution**:
1. Go to Firebase Console
2. Project Settings > General
3. Scroll ke "Your apps" section
4. Click Web app (or create if missing)
5. Copy SDK config
6. Update .env.local

### 3. Firebase SDK version mismatch
**Error**: Module not found atau version conflict

**Solution**:
```bash
# Check current versions
npm list firebase

# If needed, reinstall
npm uninstall firebase
npm install firebase@11.0.0
```

---

## Authentication Issues

### 1. Can't register new user
**Error**: `Registration failed` atau Firebase auth error

**Solution**:
1. Check email format (must be valid)
2. Check password length (min 6 characters)
3. Ensure Authentication enabled in Firebase
4. Check Firebase rules allow creation
5. Look at browser console untuk detailed error

### 2. Can't login
**Error**: `Login failed` atau `wrong password`

**Solution**:
1. Verify email exists dalam Firebase
2. Verify password correct
3. Check internet connection
4. Try logout & login again
5. Clear app cache: `npm start -- --clear`

### 3. Session not persisting
**Error**: User logged out setelah app restart

**Solution**:
1. Check AsyncStorage installed: `npm list @react-native-async-storage/async-storage`
2. Verify permissions (Android/iOS)
3. Check RootLayout provides AuthProvider

**Android Permissions** (AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## Firestore Issues

### 1. Permission denied errors
**Error**: `Permission denied (missing or insufficient permissions)`

**Solution**:
1. Check Firestore security rules
2. Verify user is authenticated
3. Check user ID matches in rules
4. Go to Firebase Console > Firestore > Rules
5. Copy dari firestore.rules file

**Temporary fix** (testing only - not for production):
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true;  // UNSAFE - for testing only
  }
}
```

### 2. Messages not loading
**Error**: Empty message list atau no messages showing

**Possible causes**:
1. **Permission issue**: Check Firestore rules
2. **Not subscribed**: Listener not active
3. **Wrong chatId**: Verify chat ID correct
4. **No data**: Check Firestore console untuk messages

**Debug**:
```typescript
// Check if messages exist
const messages = await ChatService.getMessages(chatId);
console.log('Messages:', messages);

// Check Firestore console
// Navigate to: /chats/{chatId}/messages
```

### 3. Real-time updates not working
**Error**: Messages don't update in real-time

**Solution**:
1. Verify listener is subscribed
2. Check network connection
3. Verify Firestore rules allow reads
4. Check browser console untuk errors
5. Try refreshing manually with loadMessages()

---

## Performance Issues

### 1. App feels slow
**Possible causes**:
1. Too many active listeners
2. Large message list not paginated
3. Images not optimized
4. Firestore missing indexes

**Solutions**:
```bash
# Check listeners in code
# Look for unsubscribe() calls

# Add pagination untuk large lists
# Implement lazy loading

# Create Firestore indexes
# See FIRESTORE_INDEXES.md
```

### 2. High Firestore costs
**Cause**: Too many read/write operations

**Solutions**:
1. Implement pagination
2. Use offline caching
3. Batch operations
4. Monitor dengan Firebase console

### 3. Long load times
**Cause**: Network atau Firestore issues

**Solutions**:
```typescript
// Add timeout handling
setTimeout(() => {
  if (loading) {
    // Show error atau retry
  }
}, 30000);

// Implement retry logic
const retryOperation = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

---

## UI/UX Issues

### 1. Keyboard covering input
**Issue**: Text input covered oleh keyboard

**Solution**: Sudah ditangani dengan `KeyboardAvoidingView` di ChatDetailScreen

### 2. Messages not scrolling to bottom
**Issue**: FlatList tidak scroll otomatis ke message terbaru

**Solution**:
```typescript
// In ChatDetailScreen
useEffect(() => {
  if (messages.length > 0) {
    flatListRef.current?.scrollToEnd({ animated: true });
  }
}, [messages]);
```

### 3. Dark mode colors not applying
**Issue**: Dark mode styling tidak bekerja

**Solution**:
1. Check useColorScheme() returns 'dark'
2. Verify Colors.dark values set
3. Verify components use isDarkMode
4. Clear cache: `npm start -- --clear`

### 4. Layout issues on tablet
**Issue**: UI tidak scale properly di tablet

**Solution**:
1. Use responsive units (percentage, flex)
2. Add max-width constraints
3. Test di berbagai screen sizes
4. Use Dimensions API untuk dynamic sizing

---

## Platform-Specific Issues

### iOS Issues

#### 1. Pod install fails
```bash
cd ios
pod repo update
pod install
cd ..
```

#### 2. "Module not found" errors
```bash
# Clean build
npm start -- --clear

# Rebuild
rm -rf ~/Library/Developer/Xcode/DerivedData
xcode-select --reset
```

### Android Issues

#### 1. Gradle build fails
```bash
cd android
./gradlew clean
cd ..
npm start
```

#### 2. Permission denials
- Check AndroidManifest.xml
- Add required permissions
- Grant permissions saat runtime

#### 3. Emulator slow
- Increase allocated memory
- Enable hardware acceleration
- Use Pixel 4 (good balance)

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'length' of undefined` | Data not loaded yet | Add null checks |
| `ReferenceError: X is not defined` | Missing import | Check imports |
| `CORS error` | Cross-origin issue (web) | Check Firebase config |
| `Target already exists` | Firebase version conflict | Update/reinstall |
| `Out of memory` | App memory leak | Check unsubscribes |
| `Network timeout` | Slow/no internet | Check connection |

---

## Debug Tips

### 1. Console Logging
```typescript
// Basic logging
console.log('Data:', data);

// Conditional logging
if (__DEV__) {
  console.log('Debug:', debugData);
}

// Group related logs
console.group('Chat Operations');
console.log('Creating chat...');
console.log('Chat created:', chat);
console.groupEnd();
```

### 2. Firebase Debugging
```typescript
// Enable Firebase logging
import { enableLogging } from 'firebase/firestore';
enableLogging(true);

// Check authentication state
console.log('Current user:', auth.currentUser);

// Monitor Firestore operations
// Go to Firebase Console > Usage untuk statistics
```

### 3. React DevTools
```bash
# Install React Native Debugger
# https://github.com/jhen0409/react-native-debugger

# Use Inspector untuk component debugging
# Cmd+D (iOS), Cmd+M (Android), Ctrl+M (web)
```

### 4. Network Monitor
- Open DevTools (Chrome F12)
- Go to Network tab
- Monitor API calls
- Check for failed requests

---

## Testing Firestore Directly

### 1. Via Firebase Console
1. Go to Firebase Console > Firestore
2. Browse collections
3. Check data format
4. Verify documents exist

### 2. Via Firebase Admin SDK (Node.js)
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Query data
db.collection('chats').get().then(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
});
```

---

## When All Else Fails

### Reset Development Environment
```bash
# Clear everything dan start fresh
rm -rf node_modules
rm package-lock.json
npm install
npm start -- --clear
```

### Rebuild Native Code
```bash
# Clear build artifacts
npm start -- --clear

# For iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# For Android
cd android && ./gradlew clean && cd ..
```

### Check System Requirements
```bash
# Verify Node.js version
node --version  # Should be 16+

# Verify npm version
npm --version   # Should be 8+

# Check Expo version
expo --version  # Should be 51+
```

---

## Getting Help

1. **Check Documentation**
   - README.md, CHATAPP_GUIDE.md, API_REFERENCE.md

2. **Check Logs**
   - Browser console (web)
   - Device logs (iOS/Android)
   - Firebase console logs

3. **Stack Overflow**
   - Search react-native tag
   - Search firebase tag

4. **Firebase Support**
   - Firebase Console > Support
   - Firebase Community

5. **GitHub Issues**
   - Search existing issues
   - Create detailed issue report

---

**Remember**: Most issues dapat diselesaikan dengan:
1. Reading error message carefully
2. Checking Firebase console
3. Restarting development server
4. Clearing cache dengan --clear
5. Checking security rules

**Last Updated**: December 2024
