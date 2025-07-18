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
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Wait for auth to load
        if (isLoading) return;
        
        // Add a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted) return;

        // Check if onboarding is completed
        const hasCompletedOnboarding = await checkOnboardingCompleted();

        if (!isMounted) return;

        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else if (hasCompletedOnboarding) {
          router.replace('/auth/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        if (isMounted) {
          router.replace('/onboarding');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, router]);

  // Show splash screen while initializing
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