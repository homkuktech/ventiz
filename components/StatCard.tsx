import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Stat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface StatCardProps {
  stat: Stat;
  isDark: boolean;
}

export function StatCard({ stat, isDark }: StatCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getTrendColor = () => {
    switch (stat.trend) {
      case 'up': return Colors.success[500];
      case 'down': return Colors.error[500];
      default: return theme.textSecondary;
    }
  };

  const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: stat.color }]}>
          <Text style={styles.icon}>{stat.icon}</Text>
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>
            {stat.title}
          </Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {stat.value}
          </Text>
        </View>
        {stat.trend !== 'neutral' && (
          <View style={styles.trend}>
            <TrendIcon size={16} color={getTrendColor()} strokeWidth={2} />
            <Text style={[styles.changeText, { color: getTrendColor() }]}>
              {stat.change}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
  statInfo: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  trend: {
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});