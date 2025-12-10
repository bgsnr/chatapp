# Installation & Setup Instructions

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm 8+** - Biasanya included dengan Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Create Free](https://console.firebase.google.com/)
- **Code Editor** - VS Code recommended
- **Emulator/Device** - For testing (iOS simulator, Android emulator, atau physical device)

### Verify Installation

```bash
# Check Node.js version
node --version
# Should be v16 or higher

# Check npm version
npm --version
# Should be v8 or higher

# Install Expo CLI globally
npm install -g expo-cli

# Verify Expo
expo --version
```

---

## 🔥 Step 1: Firebase Project Setup (10 minutes)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `chatapp`
4. Click "Create project"
5. Wait untuk project creation selesai

### 1.2 Enable Authentication

1. Go ke **Authentication** di sidebar
2. Click **"Get started"** atau **"Set up sign-in method"**
3. Click **Email/Password**
4. Enable toggle untuk Email/Password
5. Click **"Save"**

### 1.3 Create Firestore Database

1. Go ke **Firestore Database** di sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - Read/Write unlimited during development
   - Perfect untuk testing
4. Choose **Location** (any region fine)
5. Click **"Create"**

### 1.4 Get Firebase Config

1. Go ke **Project Settings** (gear icon top-left)
2. Select **"Your apps"** tab
3. Click **"Web app"** (atau create if not exists)
4. Copy SDK setup code dari `firebaseConfig`
5. Keep this handy untuk Step 2

---

## 💻 Step 2: Setup Project (5 minutes)

### 2.1 Clone/Extract Project

```bash
# If from git
git clone <repository-url>
cd chatapp

# Or if you have a folder
cd chatapp
```

### 2.2 Install Dependencies

```bash
# Install all packages
npm install

# If you get dependency warnings, use:
npm install --legacy-peer-deps
```

### 2.3 Create Environment File

```bash
# Create .env.local by copying template
cp .env.example .env.local

# Edit .env.local
# Open file dan fill dengan Firebase credentials
```

### 2.4 Configure Firebase Credentials

Edit `.env.local` dan paste Firebase config:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Cara mendapatkan nilai:**
- Buka Firebase Console > Project Settings
- Di bawah "Your apps" > Web app
- Copy value dari `const firebaseConfig`

---

## 🔐 Step 3: Setup Firestore Security Rules (3 minutes)

### 3.1 Copy Security Rules

1. Open `firestore.rules` file in project
2. Copy semua content

### 3.2 Apply to Firebase

1. Go ke **Firestore Database**
2. Click **"Rules"** tab
3. Replace semua content dengan content dari file
4. Click **"Publish"**

**Important**: Rules di atas memungkinkan:
- ✅ Users dapat membaca user list (untuk search)
- ✅ Users hanya bisa menulis data mereka sendiri
- ✅ Chats hanya bisa diakses oleh participants
- ✅ Messages hanya bisa diedit/delete oleh sender

---

## 🚀 Step 4: Run Application (2 minutes)

### 4.1 Start Development Server

```bash
npm start
# Output akan menunjukkan QR code dan options
```

### 4.2 Choose Platform

Pilih salah satu:

**Option 1: Web (Easiest untuk testing)**
```
Press 'w' untuk membuka di browser
```

**Option 2: iOS (Jika using Mac)**
```
Press 'i' untuk open iOS Simulator
First time akan compile - tunggu beberapa menit
```

**Option 3: Android (Jika emulator sudah berjalan)**
```
Press 'a' untuk open Android Emulator
Atau scan QR code dengan Expo Go app
```

### 4.3 Wait for Build

- Web: 30 seconds
- iOS: 2-3 minutes (first time)
- Android: 1-2 minutes (first time)

---

## ✅ Step 5: Test Application (5 minutes)

### 5.1 Register User

1. Click **"Sign up"** link
2. Fill form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: password123
   - **Confirm**: password123
3. Click **"Sign Up"**
4. Should be logged in automatically

### 5.2 Verify Registration

1. Open Firebase Console
2. Go ke **Authentication**
3. Check "test@example.com" is listed

### 5.3 Test Chat Feature

**Single Device:**
1. Click "+" atau "New Chat" button
2. Search untuk existing user (if any)
3. Or logout dan login dengan different user

**Two Devices:**
1. Device 1: Registered user 1
2. Device 2: Register user 2
3. Device 1: Search user 2, start chat
4. Device 2: Accept/see chat from user 1
5. Exchange messages

### 5.4 Verify in Firebase

Go ke **Firestore Database**:
- Check `/users` collection untuk users
- Check `/chats` collection untuk chats
- Check `/chats/{chatId}/messages` untuk messages

---

## 🎯 Verification Checklist

- [ ] Node.js & npm installed
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] `.env.local` file created
- [ ] Firebase credentials copied correctly
- [ ] `npm install` completed without errors
- [ ] Firestore rules applied
- [ ] `npm start` working
- [ ] App loads dalam browser/emulator
- [ ] Can register new user
- [ ] User appears dalam Firebase
- [ ] Can login with registered user
- [ ] Can see chats (empty initially)

---

## 📚 Next Steps

After successful installation:

1. **Read documentation**: Start dengan QUICKSTART.md
2. **Understand structure**: Read CHATAPP_GUIDE.md
3. **Learn API**: Check API_REFERENCE.md
4. **Test features**: Follow TESTING_GUIDE.md
5. **Customize**: Modify UI/features untuk kebutuhan Anda

---

## 🆘 Troubleshooting

### Issue: npm install fails
```bash
npm install --legacy-peer-deps
# Or
npm cache clean --force && npm install
```

### Issue: Firebase not configured
- Verify `.env.local` file exists
- Check semua EXPO_PUBLIC_FIREBASE_* variables filled
- Restart npm server: Press `q`, then `npm start`

### Issue: App won't start
```bash
npm start -- --clear
# This clears cache and rebuilds
```

### Issue: Can't find detailed issues?
→ Check **TROUBLESHOOTING.md**

---

## 🎨 Configuration Options

### Change Port
```bash
expo start --port 8082
```

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name"
  }
}
```

### Change Theme Colors
Edit `constants/theme.ts`:
```typescript
const Colors = {
  light: {
    tint: '#your-color'
  }
}
```

---

## 📱 Testing Devices

### Web Browser (Recommended untuk Start)
```bash
npm start
Press 'w'
```

### iOS Simulator (Mac only)
```bash
npm start
Press 'i'
# First time takes 2-3 minutes
```

### Android Emulator
```bash
# Start Android Emulator first
npm start
Press 'a'
```

### Physical Device (Any OS)
```bash
# Install Expo Go app dari app store
npm start
# Scan QR code dengan Expo Go
```

---

## 🔄 Development Workflow

```bash
# 1. Start development server
npm start

# 2. Make code changes
# Files auto-reload in app

# 3. Test changes
# See updates immediately

# 4. Debug issues
# Check terminal output atau app errors

# 5. When done
# Press 'q' to stop server
```

---

## 📦 Project Size

- **Initial Install**: ~500MB (node_modules)
- **After Build**: ~200MB (iOS), ~300MB (Android)
- **Storage Needed**: 1GB recommended

---

## ⚡ Performance Tips

1. **First run slower**: App akan cache dependencies
2. **Use web untuk testing**: Faster reload cycles
3. **Keep terminal open**: Don't close expo server
4. **Check battery**: Long development sessions drain battery
5. **WiFi recommended**: Faster dependency downloads

---

## 🔒 Security Notes

- **Never commit .env.local**: Already in .gitignore
- **Don't share Firebase credentials**: Keep private
- **Test mode rules**: Only for development
- **Before production**: Update security rules properly

---

## 📞 Need Help?

1. **Installation Issues** → Check QUICKSTART.md
2. **Setup Problems** → Check TROUBLESHOOTING.md
3. **Feature Questions** → Check API_REFERENCE.md
4. **Not Working?** → Read TESTING_GUIDE.md

---

## 🎉 Success!

If you can see the login screen, you're ready to go!

**Next**: Read QUICKSTART.md untuk feature overview.

---

**Created**: December 2024  
**Last Updated**: December 2024  
**Status**: Ready for Production
