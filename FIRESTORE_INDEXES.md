# Firestore Indexes

Aplikasi ini memerlukan beberapa Firestore indexes untuk performa optimal. Berikut adalah indexes yang perlu dibuat:

## Automatic Indexes

Firestore akan secara otomatis membuat indexes untuk:
- Single field queries (sudah tersedia)
- Basic queries

## Composite Indexes (Manual)

Untuk queries yang lebih kompleks, buat indexes berikut di Firestore console:

### 1. Chats Collection - List by Participants
**Path**: `/chats`
**Fields**:
- `participants` (Arrays)
- `updatedAt` (Descending)

**Query**: `db.collection('chats').where('participants', 'array-contains', userId).orderBy('updatedAt', 'desc')`

### 2. Messages Subcollection - Order by Date
**Path**: `/chats/{chatId}/messages`
**Fields**:
- `createdAt` (Ascending)

Note: Ini biasanya dibuat otomatis

## Cara Membuat Index Manually

1. Buka Firebase Console
2. Go to Firestore Database > Indexes
3. Click "Create Index"
4. Select collection dan fields sesuai di atas
5. Click "Create"

Atau gunakan Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Deploy indexes dari file
firebase firestore:indexes

# Atau buat manual di console (recommended untuk development)
```

## Performance Tips

1. **Limit documents**: Always use pagination untuk queries besar
2. **Index strategically**: Buat index hanya untuk queries yang sering digunakan
3. **Monitor costs**: Firestore pricing based on read/write operations
4. **Use subcollections**: Messages disimpan dalam subcollection untuk better organization

## Cost Optimization

- **Reads**: 1 read = 1 document read (terhitung pada every query)
- **Writes**: 1 write = 1 document write
- **Deletes**: 1 delete = 1 document write
- **Batch operations**: Gunakan batch writes untuk multiple operations

## Testing Indexes

1. Run queries di Firestore console
2. Check request statistics
3. Optimize jika diperlukan

---

**Note**: Development dapat dimulai dengan test mode (unlimited reads/writes). Untuk production, setup proper security rules dan billing alerts.
