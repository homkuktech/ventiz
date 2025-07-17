import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@/components/SplashScreen';
import { useAuth, checkOnboardingCompleted } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for auth to load
        if (isLoading) return;
        
        // Check if onboarding is completed
        const hasCompletedOnboarding = await checkOnboardingCompleted();

        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else if (hasCompletedOnboarding) {
          router.replace('/auth/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to onboarding if there's an error
        router.replace('/onboarding');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [isAuthenticated, isLoading, router]);

  // Show splash screen while initializing
  if (isLoading || isInitializing) {
    return (
      <View style={styles.container}>
        <SplashScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});