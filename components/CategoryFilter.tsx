import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const categories = [
  { id: 'all', name: 'All', icon: '🌟' },
  { id: 'academic', name: 'Academic', icon: '📚' },
  { id: 'social', name: 'Social', icon: '🎉' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'cultural', name: 'Cultural', icon: '🎭' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'career', name: 'Career', icon: '💼' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

export function CategoryFilter({ selectedCategory, onCategoryChange, isDark }: CategoryFilterProps) {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category.id 
                  ? Colors.primary[500] 
                  : theme.input
              }
            ]}
            onPress={() => onCategoryChange(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category.id 
                    ? 'white' 
                    : theme.text
                }
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});