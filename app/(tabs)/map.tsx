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
import { MapPin, Navigation, Shield, Search, Layers } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { CampusMap } from '@/components/CampusMap';
import { LocationCard } from '@/components/LocationCard';
import { mockLocations } from '@/data/mockLocations';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showSafetyLayer, setShowSafetyLayer] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Campus Map
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[
                styles.layerButton, 
                { backgroundColor: showSafetyLayer ? Colors.success[500] : theme.input }
              ]}
              onPress={() => setShowSafetyLayer(!showSafetyLayer)}
            >
              <Shield 
                size={18} 
                color={showSafetyLayer ? 'white' : theme.textSecondary} 
                strokeWidth={2} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.searchButton, { backgroundColor: theme.input }]}>
              <Search size={18} color={theme.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.primary[500] }]}>
            <Navigation size={16} color="white" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.secondary[500] }]}>
            <MapPin size={16} color="white" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.accent[500] }]}>
            <Layers size={16} color="white" strokeWidth={2} />
            <Text style={styles.actionButtonText}>Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Component */}
      <View style={styles.mapContainer}>
        <CampusMap 
          isDark={isDark}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          showSafetyLayer={showSafetyLayer}
        />
      </View>

      {/* Bottom Sheet with Locations */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.surface }]}>
        <View style={styles.bottomSheetHandle} />
        <Text style={[styles.bottomSheetTitle, { color: theme.text }]}>
          Campus Locations
        </Text>
        <ScrollView 
          style={styles.locationsList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {mockLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isDark={isDark}
              isSelected={selectedLocation === location.id}
              onSelect={() => setSelectedLocation(location.id)}
            />
          ))}
        </ScrollView>
      </View>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  layerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  bottomSheet: {
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.neutral[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  locationsList: {
    flex: 1,
  },
});