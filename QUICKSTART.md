# Quick Start Guide - Chat App dengan Firebase

## 5 Menit Setup

### Step 1: Firebase Setup (2 menit)

1. Buka https://console.firebase.google.com/
2. Buat project baru
3. Aktifkan Authentication (Email/Password)
4. Buat Firestore Database (test mode)
5. Copy Firebase config dari Project Settings

### Step 2: Environment Setup (1 menit)

```bash
# Rename file
cp .env.example .env.local

# Edit .env.local dengan Firebase config Anda
```

### Step 3: Install & Run (2 menit)

```bash
# Install dependencies
npm install

# Run aplikasi
npm start

# Pilih platform:
# - i untuk iOS
# - a untuk Android
# - w untuk Web
```

## Apa Saja yang Sudah Jadi?

✅ **Authentication System**
- Register dengan email & password
- Login dengan validasi
- Logout dengan secure session
- Profile management

✅ **Real-time Chat**
- One-to-one messaging
- Real-time message updates
- Message history
- Chat list

✅ **UI/UX**
- Dark mode support
- Responsive design
- Loading states
- Error handling

✅ **Type Safety**
- Full TypeScript support
- Type definitions untuk semua data

## Struktur Folder

```
services/        → Firebase operations (auth, chat)
context/         → State management (Auth, Chat)
screens/         → Screen components
components/      → Reusable UI components
types/           → TypeScript definitions
```

## Testing Chat App

### 1. Register Account
```
Email: user1@example.com
Password: password123
Name: John Doe
```

### 2. Login & Create Chat
- Login dengan akun pertama
- Buat akun kedua (user2@example.com)
- Login ke akun kedua
- Kirim pesan ke akun pertama

### 3. Check Firebase
- Lihat di Firestore untuk memastikan data tersimpan

## Customization

### Ubah Warna/Theme
Edit `constants/theme.ts`

### Ubah Layout
Edit screen components di `screens/` folder

### Ubah Validasi
Edit service methods di `services/` folder

## Dokumentasi Lengkap

Baca `CHATAPP_GUIDE.md` untuk dokumentasi lengkap dan advanced features.

## Troubleshooting

### Error: "Firebase not configured"
- Pastikan `.env.local` ada dan filled dengan benar

### Error: "Permission denied" di Firestore
- Update Firestore security rules (lihat CHATAPP_GUIDE.md)

### Messages tidak muncul
- Check browser console untuk error
- Verify data di Firestore console

## Next Steps

Setelah setup berhasil, Anda bisa:

1. **Customize UI**: Ubah colors, fonts, layouts
2. **Add Features**: 
   - Group chats
   - Typing indicators
   - Read receipts
   - File sharing
3. **Optimize Performance**: 
   - Implement pagination
   - Add offline support
   - Optimize Firestore queries
4. **Deploy**: Build dan upload ke app store

## Support

- Firebase Docs: https://firebase.google.com/docs
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev

---

**Happy coding!** 🚀
