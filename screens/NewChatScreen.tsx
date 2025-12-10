import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { db } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface NewChatScreenProps {
  onChatCreated: (chatId: string) => void;
  onClose: () => void;
}

export const NewChatScreen: React.FC<NewChatScreenProps> = ({ onChatCreated, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const { createChat } = useChat();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        // Get all users from Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);

        const foundUsers: any[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Filter users by name or email, exclude current user
          if (
            userData.id !== user?.id &&
            (userData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              userData.email.toLowerCase().includes(searchQuery.toLowerCase()))
          ) {
            foundUsers.push({
              id: doc.id,
              ...userData,
            });
          }
        });

        setUsers(foundUsers);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Failed to search users');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, user?.id]);

  const handleStartChat = async (userId: string, userName: string) => {
    setCreatingChat(true);
    try {
      const chat = await createChat(userId);
      onChatCreated(chat.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create chat');
    } finally {
      setCreatingChat(false);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        {
          backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
          borderBottomColor: isDarkMode ? Colors.dark.tabIconDefault : '#e0e0e0',
        },
      ]}
      onPress={() => handleStartChat(item.id, item.name)}
      disabled={creatingChat}
    >
      <View style={styles.userAvatar}>
        <Ionicons
          name="person-circle"
          size={40}
          color={Colors.light.tint}
        />
      </View>
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.userName,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.userEmail,
            {
              color: isDarkMode
                ? Colors.dark.tabIconDefault
                : Colors.light.tabIconDefault,
            },
          ]}
        >
          {item.email}
        </Text>
      </View>
      {item.status === 'online' && <View style={styles.onlineIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderBottomColor: isDarkMode ? Colors.dark.tabIconDefault : '#e0e0e0',
          },
        ]}
      >
        <TouchableOpacity onPress={onClose}>
          <Ionicons
            name="close"
            size={24}
            color={isDarkMode ? Colors.dark.text : Colors.light.text}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
        >
          New Chat
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.light.tabIconDefault}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: isDarkMode ? Colors.dark.tabIconDefault : '#f0f0f0',
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
            },
          ]}
          placeholder="Search users..."
          placeholderTextColor={
            isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      ) : users.length === 0 && searchQuery.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {
                color: isDarkMode
                  ? Colors.dark.tabIconDefault
                  : Colors.light.tabIconDefault,
              },
            ]}
          >
            No users found
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  userAvatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
