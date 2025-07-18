import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Calendar, Users, MapPin, User, Settings, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        href="/(tabs)"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        href="/(tabs)/social"
        options={{
          title: 'Social Pass',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        href="/(tabs)/map"
        options={{
          title: 'Campus',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        href="/(tabs)/create"
        options={{
          title: 'Create',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        href="/(tabs)/profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        href="/(tabs)/settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}