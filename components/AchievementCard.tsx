import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Award, Lock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  isUnlocked: boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
  isDark: boolean;
}

export function AchievementCard({ achievement, isDark }: AchievementCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return Colors.neutral[500];
      case 'rare': return Colors.primary[500];
      case 'epic': return Colors.secondary[500];
      case 'legendary': return Colors.warning[500];
      default: return Colors.neutral[500];
    }
  };

  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.surface,
          opacity: achievement.isUnlocked ? 1 : 0.7
        }
      ]}
    >
      <View style={styles.header}>
        <View style={[
          styles.iconContainer, 
          { 
            backgroundColor: achievement.isUnlocked 
              ? getRarityColor(achievement.rarity) 
              : theme.input
          }
        ]}>
          {achievement.isUnlocked ? (
            <Text style={styles.icon}>{achievement.icon}</Text>
          ) : (
            <Lock size={20} color={theme.textSecondary} strokeWidth={2} />
          )}
        </View>
        
        <View style={styles.achievementInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              {achievement.title}
            </Text>
            {achievement.isUnlocked && (
              <CheckCircle size={16} color={Colors.success[500]} strokeWidth={2} />
            )}
          </View>
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {achievement.description}
          </Text>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
            <Text style={styles.rarityText}>{achievement.rarity}</Text>
          </View>
        </View>

        <View style={styles.reward}>
          <Award size={16} color={Colors.warning[500]} strokeWidth={2} />
          <Text style={[styles.rewardText, { color: Colors.warning[500] }]}>
            {achievement.reward}
          </Text>
        </View>
      </View>

      {!achievement.isUnlocked && (
        <View style={styles.progress}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: theme.text }]}>
              Progress: {achievement.progress}/{achievement.maxProgress}
            </Text>
            <Text style={[styles.progressPercentage, { color: theme.textSecondary }]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.input }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: getRarityColor(achievement.rarity)
                }
              ]} 
            />
          </View>
        </View>
      )}

      {achievement.isUnlocked && achievement.unlockedAt && (
        <View style={styles.unlockedInfo}>
          <Text style={[styles.unlockedText, { color: theme.textSecondary }]}>
            Unlocked {achievement.unlockedAt}
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
  achievementInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reward: {
    alignItems: 'center',
    gap: 2,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progress: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  unlockedInfo: {
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});