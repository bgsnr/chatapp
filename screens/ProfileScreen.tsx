import { Button } from '@/components/Button';
import { TextInputField } from '@/components/TextInputField';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(name);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            onLogout();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to logout');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
      ]}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
      <View style={styles.header}>
        <View
          style={[
            styles.avatarPlaceholder,
            { backgroundColor: Colors.light.tint },
          ]}
        >
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text
          style={[
            styles.email,
            { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
          ]}
        >
          {user?.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
        >
          Profile Information
        </Text>

        <TextInputField
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        <TextInputField
          label="Email"
          placeholder="Your email"
          value={user?.email || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <View style={styles.buttonGroup}>
          {!isEditing ? (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="primary"
            />
          ) : (
            <>
              <Button
                title="Save Changes"
                onPress={handleUpdateProfile}
                loading={loading}
                variant="primary"
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setName(user?.name || '');
                  setIsEditing(false);
                }}
                variant="secondary"
              />
            </>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Button
          title={loading ? 'Logging out...' : 'Logout'}
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
});
