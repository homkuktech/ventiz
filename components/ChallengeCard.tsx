import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Target, Users, Trophy, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  reward: number;
  participants: number;
  endDate: string;
  progress: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ChallengeCardProps {
  challenge: Challenge;
  isDark: boolean;
}

export function ChallengeCard({ challenge, isDark }: ChallengeCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.success[500];
      case 'medium': return Colors.warning[500];
      case 'hard': return Colors.error[500];
      default: return Colors.neutral[500];
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: Colors.primary[50] }]}>
          <Text style={styles.icon}>{challenge.icon}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>{challenge.title}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          </View>
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {challenge.description}
          </Text>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: theme.text }]}>
            Progress: {challenge.progress}%
          </Text>
          <View style={styles.reward}>
            <Trophy size={14} color={Colors.warning[500]} strokeWidth={2} />
            <Text style={[styles.rewardText, { color: Colors.warning[500] }]}>
              {challenge.reward} XP
            </Text>
          </View>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.input }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${challenge.progress}%`,
                backgroundColor: Colors.primary[500] 
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Users size={14} color={theme.textSecondary} strokeWidth={2} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              {challenge.participants} participants
            </Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={14} color={theme.textSecondary} strokeWidth={2} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              Ends {challenge.endDate}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.joinButton, { backgroundColor: Colors.secondary[500] }]}>
          <Target size={16} color="white" strokeWidth={2} />
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
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
  },
  challengeInfo: {
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
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  progress: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
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
  footer: {
    gap: 12,
  },
  stats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});