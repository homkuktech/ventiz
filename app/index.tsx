import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@/components/SplashScreen';
import { useAuth, checkOnboardingCompleted } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
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
    };

    initializeApp();
  }, [isAuthenticated, isLoading]);

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