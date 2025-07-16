import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MapPin, Clock, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Location {
  id: string;
  name: string;
  type: string;
  distance: string;
  currentOccupancy: number;
  maxOccupancy: number;
  estimatedWaitTime: string;
  isOpen: boolean;
}

interface LocationCardProps {
  location: Location;
  isDark: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function LocationCard({ location, isDark, isSelected, onSelect }: LocationCardProps) {
  const theme = isDark ? Colors.dark : Colors.light;
  
  const occupancyPercentage = (location.currentOccupancy / location.maxOccupancy) * 100;
  const getOccupancyColor = () => {
    if (occupancyPercentage < 50) return Colors.success[500];
    if (occupancyPercentage < 80) return Colors.warning[500];
    return Colors.error[500];
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected ? Colors.primary[50] : theme.surface,
          borderColor: isSelected ? Colors.primary[500] : theme.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
      onPress={onSelect}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: isSelected ? Colors.primary[500] : theme.text }]}>
          {location.name}
        </Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: location.isOpen ? Colors.success[500] : Colors.error[500] }
        ]}>
          <Text style={styles.statusText}>
            {location.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <Text style={[styles.type, { color: theme.textSecondary }]}>
        {location.type}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MapPin size={14} color={theme.textSecondary} strokeWidth={2} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {location.distance}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Users size={14} color={getOccupancyColor()} strokeWidth={2} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {location.currentOccupancy}/{location.maxOccupancy}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Clock size={14} color={theme.textSecondary} strokeWidth={2} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {location.estimatedWaitTime}
          </Text>
        </View>
      </View>

      <View style={styles.occupancyBar}>
        <View style={[styles.occupancyTrack, { backgroundColor: theme.input }]}>
          <View 
            style={[
              styles.occupancyFill, 
              { 
                width: `${occupancyPercentage}%`,
                backgroundColor: getOccupancyColor()
              }
            ]} 
          />
        </View>
        <Text style={[styles.occupancyText, { color: theme.textSecondary }]}>
          {Math.round(occupancyPercentage)}% full
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  details: {
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  occupancyBar: {
    gap: 4,
  },
  occupancyTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 2,
  },
  occupancyText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});