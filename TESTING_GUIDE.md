# Testing Guide

## Manual Testing Scenarios

### Scenario 1: User Registration & Login

#### Setup
1. Install dan run aplikasi
2. App should show Login screen

#### Test Steps
1. Click "Sign up" link
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm: "password123"
3. Click "Sign Up"

#### Expected Result
✅ User registered in Firebase
✅ User logged in automatically
✅ Redirect to Chat screen
✅ Check Firebase Console > Authentication untuk verify user

---

### Scenario 2: Login dengan Existing User

#### Setup
1. User sudah terdaftar (dari Scenario 1)
2. App showing Login screen

#### Test Steps
1. Fill form:
   - Email: "test@example.com"
   - Password: "password123"
2. Click "Sign In"

#### Expected Result
✅ User logged in successfully
✅ Redirect to Chat screen
✅ User data loaded

---

### Scenario 3: Create Multiple Users untuk Chat

#### Setup
1. First user sudah logged in

#### Test Steps
1. Register second user:
   - Name: "Other User"
   - Email: "other@example.com"
   - Password: "password456"
2. After registration, logout (profile screen)
3. Login dengan first user kembali

#### Expected Result
✅ Two users dalam Firebase
✅ Both can login separately

---

### Scenario 4: Send Messages Between Users

#### Setup
1. Open 2 devices/emulators
2. User 1 logged in di device 1
3. User 2 logged in di device 2

#### Test Steps

**Device 1:**
1. Tap "+" atau "New Chat" button
2. Search "Other User" atau email
3. Click user untuk open chat
4. Type message: "Hello from User 1"
5. Tap send

**Device 2:**
1. Should see new chat dari "Test User" muncul
2. Click untuk open chat
3. Should see message "Hello from User 1"
4. Type reply: "Hello back!"
5. Tap send

**Device 1:**
1. Should see reply muncul in real-time

#### Expected Result
✅ Messages send successfully
✅ Real-time updates di both devices
✅ Message history saved
✅ Check Firestore untuk verify data

---

### Scenario 5: Persistence & Reload

#### Setup
1. User logged in dengan messages di chat

#### Test Steps
1. Kill app completely
2. Reopen app

#### Expected Result
✅ User still logged in (AsyncStorage persistence)
✅ Chat history masih ada
✅ Can continue messaging

---

### Scenario 6: Update Profile

#### Setup
1. User logged in
2. Navigate to Profile screen

#### Test Steps
1. Click "Edit Profile"
2. Change name to "Updated Name"
3. Click "Save Changes"

#### Expected Result
✅ Profile updated in Firebase
✅ Name changed di all chats
✅ Verification in Firebase Console

---

### Scenario 7: Logout

#### Setup
1. User logged in

#### Test Steps
1. Go to Profile screen
2. Tap "Logout"
3. Confirm logout

#### Expected Result
✅ User logged out
✅ Redirect to Login screen
✅ AsyncStorage cleared
✅ Can login dengan user lain

---

## Error Scenarios

### Error 1: Invalid Email Format
```
Input: "notanemail"
Expected: Error message "Invalid email format"
```

### Error 2: Password Too Short
```
Input: "12345"
Expected: Error message "Password must be at least 6 characters"
```

### Error 3: Passwords Don't Match
```
Input: 
  Password: "password123"
  Confirm: "password456"
Expected: Error message "Passwords do not match"
```

### Error 4: Wrong Password
```
Input:
  Email: "test@example.com"
  Password: "wrongpassword"
Expected: Error message atau auth error dari Firebase
```

### Error 5: Network Error
```
Scenario: Turn off internet, try to send message
Expected: Error message displayed
After reconnect: Message can be sent
```

---

## Performance Testing

### Load Test: 100 Messages
1. Send 100 messages in rapid succession
2. Monitor:
   - App doesn't crash
   - Messages all show up
   - No duplicates
   - Performance doesn't degrade

### Load Test: Multiple Chats
1. Create 10 different chats
2. Send messages di each
3. Check Firebase reads/writes

### Load Test: Real-time Updates
1. Open 2 devices
2. Send messages rapidly
3. Verify real-time sync
4. Check latency

---

## Firebase Testing

### Verify Users Collection
```
Go to Firebase Console > Firestore Database
Check: /users/{userId}
Should contain:
- id
- email
- name
- createdAt
- status
- lastSeen
```

### Verify Chats Collection
```
Check: /chats/{chatId}
Should contain:
- participants (array)
- participantNames (array)
- lastMessage
- lastMessageTime
- lastMessageSender
- createdAt
- updatedAt
```

### Verify Messages Subcollection
```
Check: /chats/{chatId}/messages/{messageId}
Should contain:
- chatId
- senderId
- senderName
- text
- createdAt
- isEdited
```

---

## Security Testing

### Test 1: Can't Access Others' Chats
```
Device 1 (User 1):
- Open chat dengan User 2

Device 2 (User 3):
- Try to access same chat ID manually
Expected: Permission denied error
```

### Test 2: Can't Edit Others' Messages
```
Scenario:
- User A sends message
- User B tries to edit message
Expected: Permission denied (check Firestore rules)
```

### Test 3: Firestore Rules Enforcement
```
Direct Firestore write without auth:
Expected: Permission denied
```

---

## UI/UX Testing

### Dark Mode
1. Toggle system dark mode
2. Verify:
   - All text readable
   - Colors appropriate
   - No contrast issues

### Responsive Layout
1. Test on different screen sizes:
   - Small phone (375px)
   - Regular phone (414px)
   - Large phone (600px)
   - Tablet (1000px)
2. Verify layouts adjust properly

### Loading States
1. Send message dengan slow network
2. Verify loading indicator shown
3. Can't send while loading

### Error Display
1. Trigger various errors
2. Verify error messages clear
3. Can retry operations

---

## Checklist for Release

- [ ] All authentication flows work
- [ ] Messages send/receive in real-time
- [ ] Firebase rules applied
- [ ] Dark mode works
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security rules verified
- [ ] Error handling works
- [ ] Data persists
- [ ] Logout clears data
- [ ] Profile update works

---

## Continuous Testing (CI/CD)

### Recommended Setup
```bash
# Unit tests
npm run test

# Lint
npm run lint

# Build
npm run build

# E2E tests (future)
npm run test:e2e
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Messages don't load | Firestore rules | Check rules, verify user is participant |
| Slow messages | Too many listeners | Unsubscribe from listeners |
| Duplicate messages | Double sends | Add debounce to send button |
| Real-time not working | No listener active | Ensure listener is subscribed |
| Profile not updating | User not owner | Verify user ID in rules |

---

**Last Updated**: December 2024
