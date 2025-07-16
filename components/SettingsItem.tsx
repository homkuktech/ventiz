import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  isDark: boolean;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  titleColor?: string;
  showBorder?: boolean;
}

export function SettingsItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  isDark, 
  onPress,
  rightComponent,
  titleColor,
  showBorder = true
}: SettingsItemProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        showBorder && { borderBottomWidth: 1, borderBottomColor: theme.border }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.input }]}>
        <Icon size={20} color={titleColor || theme.text} strokeWidth={2} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor || theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      </View>

      {rightComponent && (
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  rightSection: {
    marginLeft: 16,
  },
});