import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit3, Award, Calendar, Users, TrendingUp, Shield, Star, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { AchievementCard } from '@/components/AchievementCard';
import { StatCard } from '@/components/StatCard';
import { mockAchievements, mockUserStats } from '@/data/mockProfile';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'stats' | 'achievements'>('stats');

  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.surface }]}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
              style={styles.profileImage}
            />
            <View style={[styles.statusBadge, { backgroundColor: Colors.success[500] }]}>
              <Shield size={12} color="white" strokeWidth={2} />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user ? `${user.firstName} ${user.lastName}` : 'Alex Johnson'}
            </Text>
            <Text style={[styles.profileTitle, { color: theme.textSecondary }]}>
              {user ? `${user.major} • Class of 2025` : 'Computer Science • Class of 2025'}
            </Text>
            <Text style={[styles.profileUniversity, { color: Colors.primary[500] }]}>
              {user?.university || 'University of Technology'}
            </Text>
          </View>

          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.input }]}>
            <Edit3 size={18} color={theme.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        <View style={[styles.levelSection, { backgroundColor: theme.surface }]}>
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <Text style={[styles.levelTitle, { color: theme.text }]}>
                Campus Explorer
              </Text>
              <Text style={[styles.levelSubtitle, { color: theme.textSecondary }]}>
                Level 12 • 2,340 XP
              </Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: Colors.primary[500] }]}>
              <Star size={16} color="white" strokeWidth={2} />
              <Text style={styles.levelBadgeText}>12</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.input }]}>
              <View style={[styles.progressFill, { width: '68%', backgroundColor: Colors.primary[500] }]} />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              1,160 XP to Level 13
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'stats' && { backgroundColor: Colors.primary[50] }
            ]}
            onPress={() => setActiveTab('stats')}
          >
            <TrendingUp 
              size={18} 
              color={activeTab === 'stats' ? Colors.primary[500] : theme.textSecondary} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'stats' ? Colors.primary[500] : theme.textSecondary }
            ]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'achievements' && { backgroundColor: Colors.secondary[50] }
            ]}
            onPress={() => setActiveTab('achievements')}
          >
            <Award 
              size={18} 
              color={activeTab === 'achievements' ? Colors.secondary[500] : theme.textSecondary} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'achievements' ? Colors.secondary[500] : theme.textSecondary }
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'stats' && (
            <View style={styles.statsContainer}>
              {mockUserStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  stat={stat}
                  isDark={isDark}
                />
              ))}
            </View>
          )}

          {activeTab === 'achievements' && (
            <View style={styles.achievementsContainer}>
              {mockAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isDark={isDark}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileUniversity: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  levelSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  levelBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsContainer: {
    gap: 12,
  },
  achievementsContainer: {
    gap: 12,
  },
});