import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Users, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { eventService } from '@/services/eventService';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
  isLiked: boolean;
  organizer: string;
  type?: 'free' | 'paid';
  price?: number;
}

interface EventCardProps {
  event: Event;
  isDark: boolean;
}

export function EventCard({ event, isDark }: EventCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const handleEventPress = () => {
    router.push(`/events/${event.id}`);
  };

  const handleJoinEvent = async (e: any) => {
    e.stopPropagation(); // Prevent navigation when joining
    
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to join events');
      return;
    }

    if (event.type === 'free') {
      setIsJoining(true);
      const result = await eventService.joinFreeEvent(event.id);
      
      if (result.success) {
        Alert.alert('Success', 'You have successfully joined the event!');
      } else {
        Alert.alert('Error', result.error || 'Failed to join event');
      }
      setIsJoining(false);
    } else {
      // Navigate to event details for paid events
      router.push(`/events/${event.id}`);
    }
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

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={handleEventPress}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <TouchableOpacity style={styles.likeButton}>
            <Heart 
              size={20} 
              color={event.isLiked ? Colors.error[500] : theme.textSecondary}
              fill={event.isLiked ? Colors.error[500] : 'none'}
              strokeWidth={2} 
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{event.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Calendar size={14} color={theme.textSecondary} strokeWidth={2} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {event.date} • {event.time}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={14} color={theme.textSecondary} strokeWidth={2} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {event.location}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={14} color={theme.textSecondary} strokeWidth={2} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {event.attendees} attending
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.organizer, { color: theme.textSecondary }]}>
            by {event.organizer}
          </Text>
          <TouchableOpacity 
            style={[styles.joinButton, { backgroundColor: Colors.primary[500] }]}
            onPress={handleJoinEvent}
          >
            <Text style={styles.joinButtonText}>
              {isJoining ? 'Joining...' : event.type === 'paid' ? `$${event.price}` : 'Join Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  likeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
  },
  details: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizer: {
    fontSize: 12,
    fontWeight: '500',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});