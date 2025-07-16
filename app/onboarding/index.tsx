import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Calendar, Users, MapPin, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { OnboardingPager, OnboardingPagerRef } from '@/components/OnboardingPager';
import { markOnboardingCompleted } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Discover Amazing Events',
    subtitle: 'Find events that match your interests with AI-powered recommendations',
    icon: Calendar,
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
    color: Colors.primary[500],
  },
  {
    id: 2,
    title: 'Connect with Students',
    subtitle: 'Build meaningful connections through shared experiences and interests',
    icon: Users,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    color: Colors.secondary[500],
  },
  {
    id: 3,
    title: 'Navigate Your Campus',
    subtitle: 'Interactive maps with real-time event locations and campus information',
    icon: MapPin,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    color: Colors.accent[500],
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<OnboardingPagerRef>(null);
  const animatedValue = useSharedValue(0);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      pagerRef.current?.setPage(nextPage);
      animatedValue.value = withSpring(nextPage);
    } else {
      markOnboardingCompleted();
      router.replace('/auth/login');
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      pagerRef.current?.setPage(prevPage);
      animatedValue.value = withSpring(prevPage);
    }
  };

  const handleSkip = () => {
    markOnboardingCompleted();
    router.replace('/auth/login');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, 1, 2],
            [0, -width, -width * 2],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <OnboardingPager
          ref={pagerRef}
          onPageSelected={(e) => {
            const page = e.nativeEvent.position;
            setCurrentPage(page);
            animatedValue.value = withSpring(page);
          }}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.page}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={[styles.iconOverlay, { backgroundColor: item.color }]}>
                  <item.icon size={32} color="white" strokeWidth={2} />
                </View>
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </OnboardingPager>
      </View>

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: currentPage === index ? Colors.primary[500] : theme.border,
                width: currentPage === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.navButton,
            styles.prevButton,
            {
              backgroundColor: currentPage > 0 ? theme.input : 'transparent',
              opacity: currentPage > 0 ? 1 : 0.3,
            },
          ]}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={24} color={theme.text} strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton, { backgroundColor: Colors.primary[500] }]}
        >
          {currentPage === onboardingData.length - 1 ? (
            <Text style={styles.getStartedText}>Get Started</Text>
          ) : (
            <ChevronRight size={24} color="white" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 48,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  navButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  prevButton: {
    width: 56,
  },
  nextButton: {
    paddingHorizontal: 24,
    minWidth: 56,
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
});