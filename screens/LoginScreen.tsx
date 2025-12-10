import { Button } from '@/components/Button';
import { TextInputField } from '@/components/TextInputField';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
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
        <Text
          style={[
            styles.title,
            { color: isDarkMode ? Colors.dark.text : Colors.light.text },
          ]}
        >
          Welcome Back
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault },
          ]}
        >
          Sign in to continue
        </Text>
      </View>

      <View style={styles.form}>
        <TextInputField
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        <TextInputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={!email || !password}
        />

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: isDarkMode ? Colors.dark.text : Colors.light.text },
            ]}
          >
            Dont have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={[styles.linkText, { color: Colors.light.tint }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'flex-start',
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
