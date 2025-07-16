import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Heart, Share, MoveHorizontal as MoreHorizontal, DollarSign, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/events';
import { eventService } from '@/services/eventService';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentModal } from '@/components/PaymentModal';

export default function EventDetailsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    setIsLoading(true);
    const eventData = await eventService.getEvent(id);
    setEvent(eventData);
    setIsLoading(false);
  };

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to join events');
      return;
    }

    if (!event) return;

    if (event.type === 'free') {
      setIsJoining(true);
      const result = await eventService.joinFreeEvent(event.id);
      
      if (result.success) {
        Alert.alert('Success', 'You have successfully joined the event!');
        // Refresh event data
        loadEvent();
      } else {
        Alert.alert('Error', result.error || 'Failed to join event');
      }
      setIsJoining(false);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    Alert.alert('Success', 'Ticket purchased successfully!');
    loadEvent(); // Refresh event data
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return Colors.primary[500];
      case 'social': return Colors.secondary[500];
      case 'sports': return Colors.accent[500];
      case 'cultural': return Colors.warning[500];
      default: return Colors.neutral[500];
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading event...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Event not found</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: Colors.primary[500] }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isEventFull = event.currentAttendees >= event.capacity;
  const availableSpots = event.capacity - event.currentAttendees;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Heart size={20} color={theme.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={20} color={theme.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={20} color={theme.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <Image source={{ uri: event.coverImage }} style={styles.coverImage} />

        {/* Event Info */}
        <View style={[styles.eventInfo, { backgroundColor: theme.surface }]}>
          <View style={styles.eventHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            {event.type === 'paid' && (
              <View style={[styles.priceBadge, { backgroundColor: Colors.success[500] }]}>
                <DollarSign size={14} color="white" strokeWidth={2} />
                <Text style={styles.priceText}>${event.price}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
          
          <View style={styles.organizerInfo}>
            <Text style={[styles.organizerText, { color: theme.textSecondary }]}>
              Organized by {event.organizerName}
            </Text>
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.detailItem}>
              <Calendar size={18} color={theme.textSecondary} strokeWidth={2} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {event.date}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={18} color={theme.textSecondary} strokeWidth={2} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {event.time}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={18} color={theme.textSecondary} strokeWidth={2} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {event.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={18} color={theme.textSecondary} strokeWidth={2} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {event.currentAttendees}/{event.capacity} attending
              </Text>
            </View>
          </View>

          {/* Capacity Warning */}
          {availableSpots <= 10 && availableSpots > 0 && (
            <View style={[styles.warningBanner, { backgroundColor: Colors.warning[50] }]}>
              <Text style={[styles.warningText, { color: Colors.warning[700] }]}>
                Only {availableSpots} spots left!
              </Text>
            </View>
          )}

          {isEventFull && (
            <View style={[styles.warningBanner, { backgroundColor: Colors.error[50] }]}>
              <Text style={[styles.warningText, { color: Colors.error[700] }]}>
                This event is sold out
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {event.description}
          </Text>
        </View>

        {/* Tags */}
        {event.tags.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: Colors.primary[100] }]}>
                  <Text style={[styles.tagText, { color: Colors.primary[700] }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Requirements */}
        {event.requirements && event.requirements.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Requirements</Text>
            {event.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Text style={[styles.requirementText, { color: theme.textSecondary }]}>
                  • {requirement}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Join Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            {
              backgroundColor: isEventFull 
                ? Colors.neutral[400] 
                : event.type === 'paid' 
                  ? Colors.primary[500] 
                  : Colors.success[500],
              opacity: isJoining ? 0.7 : 1,
            }
          ]}
          onPress={handleJoinEvent}
          disabled={isJoining || isEventFull}
        >
          <Text style={styles.joinButtonText}>
            {isEventFull 
              ? 'Sold Out' 
              : isJoining 
                ? 'Joining...' 
                : event.type === 'paid' 
                  ? `Buy Ticket - $${event.price}` 
                  : 'Join Event'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      {event && (
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          event={event}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  coverImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 20,
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 32,
  },
  organizerInfo: {
    marginBottom: 16,
  },
  organizerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
  },
  warningBanner: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementItem: {
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  joinButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});