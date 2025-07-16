import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, UserPlus, Users, Award, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { SocialCard } from '@/components/SocialCard';
import { ChallengeCard } from '@/components/ChallengeCard';
import { mockConnections, mockChallenges } from '@/data/mockSocial';

export default function SocialScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'connections' | 'challenges'>('connections');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Social Pass
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={16} color={Colors.primary[500]} strokeWidth={2} />
              <Text style={[styles.statText, { color: theme.text }]}>124</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={16} color={Colors.secondary[500]} strokeWidth={2} />
              <Text style={[styles.statText, { color: theme.text }]}>2,340</Text>
            </View>
          </View>
        </View>

        {/* QR Code Button */}
        <TouchableOpacity style={[styles.qrButton, { backgroundColor: Colors.primary[500] }]}>
          <QrCode size={24} color="white" strokeWidth={2} />
          <Text style={styles.qrButtonText}>Share Your Social Pass</Text>
        </TouchableOpacity>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'connections' && { backgroundColor: Colors.primary[50] }
            ]}
            onPress={() => setActiveTab('connections')}
          >
            <UserPlus 
              size={18} 
              color={activeTab === 'connections' ? Colors.primary[500] : theme.textSecondary} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'connections' ? Colors.primary[500] : theme.textSecondary }
            ]}>
              Connections
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'challenges' && { backgroundColor: Colors.secondary[50] }
            ]}
            onPress={() => setActiveTab('challenges')}
          >
            <Zap 
              size={18} 
              color={activeTab === 'challenges' ? Colors.secondary[500] : theme.textSecondary} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'challenges' ? Colors.secondary[500] : theme.textSecondary }
            ]}>
              Challenges
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'connections' && (
          <View style={styles.connectionsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Connections
            </Text>
            {mockConnections.map((connection) => (
              <SocialCard
                key={connection.id}
                connection={connection}
                isDark={isDark}
              />
            ))}
          </View>
        )}

        {activeTab === 'challenges' && (
          <View style={styles.challengesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Active Challenges
            </Text>
            {mockChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isDark={isDark}
              />
            ))}
          </View>
        )}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  connectionsContainer: {
    padding: 20,
  },
  challengesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});