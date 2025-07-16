import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MapPin, Shield, Navigation, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface CampusMapProps {
  isDark: boolean;
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  showSafetyLayer: boolean;
}

// Mock map points
const mapPoints = [
  { id: 'library', x: 150, y: 100, type: 'building', name: 'Main Library' },
  { id: 'cafeteria', x: 200, y: 200, type: 'food', name: 'Student Cafeteria' },
  { id: 'gym', x: 100, y: 250, type: 'sports', name: 'Sports Complex' },
  { id: 'event1', x: 250, y: 150, type: 'event', name: 'Tech Talk' },
  { id: 'emergency1', x: 80, y: 80, type: 'emergency', name: 'Emergency Station' },
  { id: 'emergency2', x: 270, y: 280, type: 'emergency', name: 'Security Office' },
];

export function CampusMap({ isDark, selectedLocation, onLocationSelect, showSafetyLayer }: CampusMapProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  const getPointColor = (type: string) => {
    switch (type) {
      case 'building': return Colors.primary[500];
      case 'food': return Colors.accent[500];
      case 'sports': return Colors.secondary[500];
      case 'event': return Colors.warning[500];
      case 'emergency': return Colors.error[500];
      default: return Colors.neutral[500];
    }
  };

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'building': return MapPin;
      case 'food': return MapPin;
      case 'sports': return MapPin;
      case 'event': return Zap;
      case 'emergency': return Shield;
      default: return MapPin;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.input }]}>
      {/* Map Background */}
      <View style={styles.mapArea}>
        {/* Campus outline */}
        <View style={[styles.campusOutline, { borderColor: theme.border }]} />
        
        {/* Buildings */}
        <View style={[styles.building, styles.building1, { backgroundColor: theme.surface }]} />
        <View style={[styles.building, styles.building2, { backgroundColor: theme.surface }]} />
        <View style={[styles.building, styles.building3, { backgroundColor: theme.surface }]} />
        <View style={[styles.building, styles.building4, { backgroundColor: theme.surface }]} />

        {/* Pathways */}
        <View style={[styles.pathway, styles.pathway1, { backgroundColor: theme.border }]} />
        <View style={[styles.pathway, styles.pathway2, { backgroundColor: theme.border }]} />

        {/* Map Points */}
        {mapPoints.map((point) => {
          const IconComponent = getPointIcon(point.type);
          const isEmergency = point.type === 'emergency';
          const shouldShow = !isEmergency || showSafetyLayer;
          
          if (!shouldShow) return null;

          return (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.mapPoint,
                {
                  left: point.x,
                  top: point.y,
                  backgroundColor: getPointColor(point.type),
                  transform: selectedLocation === point.id ? [{ scale: 1.2 }] : [{ scale: 1 }],
                }
              ]}
              onPress={() => onLocationSelect(point.id)}
            >
              <IconComponent size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
          );
        })}

        {/* User location */}
        <View style={[styles.userLocation, { backgroundColor: Colors.success[500] }]}>
          <Navigation size={12} color="white" strokeWidth={2} />
        </View>
      </View>

      {/* Map Legend */}
      <View style={[styles.legend, { backgroundColor: theme.surface }]}>
        <Text style={[styles.legendTitle, { color: theme.text }]}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary[500] }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Buildings</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning[500] }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Events</Text>
          </View>
          {showSafetyLayer && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.error[500] }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Safety</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  campusOutline: {
    position: 'absolute',
    width: '90%',
    height: '80%',
    top: '10%',
    left: '5%',
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  building: {
    position: 'absolute',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  building1: {
    width: 60,
    height: 40,
    top: 80,
    left: 120,
  },
  building2: {
    width: 50,
    height: 50,
    top: 180,
    left: 180,
  },
  building3: {
    width: 70,
    height: 35,
    top: 230,
    left: 80,
  },
  building4: {
    width: 45,
    height: 60,
    top: 120,
    left: 230,
  },
  pathway: {
    position: 'absolute',
    borderRadius: 2,
  },
  pathway1: {
    width: 200,
    height: 8,
    top: 160,
    left: 100,
  },
  pathway2: {
    width: 8,
    height: 150,
    top: 100,
    left: 180,
  },
  mapPoint: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userLocation: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    top: 200,
    left: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
});