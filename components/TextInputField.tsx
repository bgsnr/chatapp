import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  editable?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  editable = true,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
            borderColor: error ? '#ff4444' : isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Sohne, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});
