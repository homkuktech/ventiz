import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface SocialLoginButtonProps {
  provider: 'Google' | 'Apple' | 'Microsoft';
  onPress: () => void;
  isDark: boolean;
}

export function SocialLoginButton({ provider, onPress, isDark }: SocialLoginButtonProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getProviderConfig = () => {
    switch (provider) {
      case 'Google':
        return {
          icon: '🔍',
          backgroundColor: theme.surface,
          textColor: theme.text,
          borderColor: theme.border,
        };
      case 'Apple':
        return {
          icon: '🍎',
          backgroundColor: isDark ? 'white' : '#000',
          textColor: isDark ? '#000' : 'white',
          borderColor: 'transparent',
        };
      case 'Microsoft':
        return {
          icon: '🪟',
          backgroundColor: '#0078D4',
          textColor: 'white',
          borderColor: 'transparent',
        };
      default:
        return {
          icon: '🔗',
          backgroundColor: theme.surface,
          textColor: theme.text,
          borderColor: theme.border,
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderWidth: config.borderColor === 'transparent' ? 0 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[styles.text, { color: config.textColor }]}>
          Continue with {provider}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});