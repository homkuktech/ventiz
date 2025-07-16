import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MessageCircle, UserPlus, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Connection {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  mutualConnections: number;
  lastSeen: string;
  isOnline: boolean;
  commonEvent?: string;
}

interface SocialCardProps {
  connection: Connection;
  isDark: boolean;
}

export function SocialCard({ connection, isDark }: SocialCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: connection.avatar }} style={styles.avatar} />
          {connection.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: Colors.success[500] }]} />}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.text }]}>{connection.name}</Text>
          <Text style={[styles.details, { color: theme.textSecondary }]}>
            {connection.major} • {connection.university}
          </Text>
          {connection.mutualConnections > 0 && (
            <Text style={[styles.mutual, { color: Colors.primary[500] }]}>
              {connection.mutualConnections} mutual connections
            </Text>
          )}
        </View>
        <Text style={[styles.lastSeen, { color: theme.textSecondary }]}>
          {connection.lastSeen}
        </Text>
      </View>

      {connection.commonEvent && (
        <View style={[styles.commonEvent, { backgroundColor: theme.input }]}>
          <Calendar size={14} color={Colors.primary[500]} strokeWidth={2} />
          <Text style={[styles.commonEventText, { color: theme.text }]}>
            Met at: {connection.commonEvent}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.primary[500] }]}>
          <UserPlus size={16} color="white" strokeWidth={2} />
          <Text style={styles.actionButtonText}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.input }]}>
          <MessageCircle size={16} color={theme.text} strokeWidth={2} />
          <Text style={[styles.actionButtonTextSecondary, { color: theme.text }]}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  details: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  mutual: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastSeen: {
    fontSize: 12,
    fontWeight: '500',
  },
  commonEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  commonEventText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },
});