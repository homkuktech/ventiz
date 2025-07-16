import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

export interface OnboardingPagerRef {
  setPage: (page: number) => void;
}

interface OnboardingPagerProps {
  children: React.ReactNode;
  onPageSelected: (e: { nativeEvent: { position: number } }) => void;
}

export const OnboardingPager = forwardRef<OnboardingPagerRef, OnboardingPagerProps>(
  ({ children, onPageSelected }, ref) => {
    const pagerViewRef = useRef<PagerView>(null);

    useImperativeHandle(ref, () => ({
      setPage: (page: number) => {
        pagerViewRef.current?.setPage(page);
      },
    }));

    return (
      <PagerView
        ref={pagerViewRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {children}
      </PagerView>
    );
  }
);

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});