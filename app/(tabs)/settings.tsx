import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Bell, Shield, Users, CircleHelp as HelpCircle, LogOut, ChevronRight, MapPin, Eye, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { SettingsSection } from '@/components/SettingsSection';
import { SettingsItem } from '@/components/SettingsItem';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark);

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <SettingsSection title="Appearance" isDark={isDark}>
          <SettingsItem
            icon={darkMode ? Moon : Sun}
            title="Dark Mode"
            subtitle="Toggle dark/light theme"
            isDark={isDark}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                thumbColor="white"
              />
            }
          />
        </SettingsSection>

        {/* Privacy & Safety */}
        <SettingsSection title="Privacy & Safety" isDark={isDark}>
          <SettingsItem
            icon={Eye}
            title="Private Profile"
            subtitle="Make your profile visible to connections only"
            isDark={isDark}
            rightComponent={
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                thumbColor="white"
              />
            }
          />
          <SettingsItem
            icon={MapPin}
            title="Location Sharing"
            subtitle="Share your location with trusted friends"
            isDark={isDark}
            rightComponent={
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: Colors.neutral[300], true: Colors.success[500] }}
                thumbColor="white"
              />
            }
          />
          <SettingsItem
            icon={Shield}
            title="Emergency Contacts"
            subtitle="Manage your emergency contact list"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" isDark={isDark}>
          <SettingsItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive notifications about events and messages"
            isDark={isDark}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                thumbColor="white"
              />
            }
          />
          <SettingsItem
            icon={MessageCircle}
            title="Message Notifications"
            subtitle="Get notified of new messages"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
        </SettingsSection>

        {/* Social */}
        <SettingsSection title="Social" isDark={isDark}>
          <SettingsItem
            icon={Users}
            title="Friend Requests"
            subtitle="Manage incoming friend requests"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
          <SettingsItem
            icon={Users}
            title="Blocked Users"
            subtitle="View and manage blocked users"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support" isDark={isDark}>
          <SettingsItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="Get help and find answers"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
          <SettingsItem
            icon={MessageCircle}
            title="Contact Support"
            subtitle="Reach out to our support team"
            isDark={isDark}
            onPress={() => {}}
            rightComponent={<ChevronRight size={20} color={theme.textSecondary} strokeWidth={2} />}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account" isDark={isDark}>
          <SettingsItem
            icon={LogOut}
            title="Sign Out"
            subtitle="Sign out of your account"
            isDark={isDark}
            onPress={handleLogout}
            titleColor={Colors.error[500]}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Univent v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made with ❤️ for university students
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});