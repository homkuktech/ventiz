import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export interface OnboardingPagerRef {
  setPage: (page: number) => void;
}

interface OnboardingPagerProps {
  children: React.ReactNode;
  onPageSelected: (e: { nativeEvent: { position: number } }) => void;
}

export const OnboardingPager = forwardRef<OnboardingPagerRef, OnboardingPagerProps>(
  ({ children, onPageSelected }, ref) => {
    const scrollViewRef = useRef<ScrollView>(null);

    useImperativeHandle(ref, () => ({
      setPage: (page: number) => {
        scrollViewRef.current?.scrollTo({
          x: page * width,
          animated: true,
        });
      },
    }));

    const handleScroll = (event: any) => {
      const { contentOffset } = event.nativeEvent;
      const page = Math.round(contentOffset.x / width);
      onPageSelected({ nativeEvent: { position: page } });
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
      >
        {children}
      </ScrollView>
    );
  }
);

OnboardingPager.displayName = 'OnboardingPager';

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});