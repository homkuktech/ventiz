import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Camera, 
  DollarSign,
  Tag,
  FileText,
  Plus,
  X
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { CreateEventData } from '@/types/events';
import { eventService } from '@/services/eventService';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  { id: 'academic', name: 'Academic', icon: '📚' },
  { id: 'social', name: 'Social', icon: '🎉' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'cultural', name: 'Cultural', icon: '🎭' },
  { id: 'career', name: 'Career', icon: '💼' },
  { id: 'tech', name: 'Tech', icon: '💻' },
];

export default function CreateEventScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    coverImage: '',
    category: 'academic',
    type: 'free',
    price: 0,
    currency: 'usd',
    tags: [],
    requirements: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to be logged in to create events.',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    }
  }, [isAuthenticated]);

  const updateFormData = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements?.includes(newRequirement.trim())) {
      updateFormData('requirements', [...(formData.requirements || []), newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    updateFormData('requirements', formData.requirements?.filter(req => req !== reqToRemove) || []);
  };

  const handleImagePicker = () => {
    // Mock image selection
    const mockImages = [
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    updateFormData('coverImage', randomImage);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Event description is required');
      return false;
    }
    if (!formData.date) {
      setError('Event date is required');
      return false;
    }
    if (!formData.time) {
      setError('Event time is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Event location is required');
      return false;
    }
    if (formData.capacity < 1) {
      setError('Capacity must be at least 1');
      return false;
    }
    if (formData.type === 'paid' && (!formData.price || formData.price <= 0)) {
      setError('Price is required for paid events');
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    const result = await eventService.createEvent(formData);

    if (result.success) {
      Alert.alert(
        'Event Created!',
        'Your event has been successfully created and published.',
        [
          {
            text: 'View Event',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );
    } else {
      setError(result.error || 'Failed to create event');
    }

    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.authRequired}>
          <Text style={[styles.authRequiredText, { color: theme.text }]}>
            Please log in to create events
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Create Event
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: Colors.error[50] }]}>
            <Text style={[styles.errorText, { color: Colors.error[500] }]}>{error}</Text>
          </View>
        ) : null}

        {/* Cover Image */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Cover Image</Text>
          <TouchableOpacity
            style={[styles.imageUpload, { backgroundColor: theme.input }]}
            onPress={handleImagePicker}
          >
            {formData.coverImage ? (
              <Image source={{ uri: formData.coverImage }} style={styles.coverImage} />
            ) : (
              <View style={styles.imageUploadContent}>
                <Camera size={32} color={theme.textSecondary} strokeWidth={2} />
                <Text style={[styles.imageUploadText, { color: theme.textSecondary }]}>
                  Add Cover Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Event Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Enter event title"
              placeholderTextColor={theme.textSecondary}
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Describe your event..."
              placeholderTextColor={theme.textSecondary}
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: formData.category === category.id 
                          ? Colors.primary[500] 
                          : theme.input
                      }
                    ]}
                    onPress={() => updateFormData('category', category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: formData.category === category.id 
                            ? 'white' 
                            : theme.text
                        }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Date & Time</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Date</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, { backgroundColor: theme.input }]}
                onPress={() => {
                  // Mock date selection
                  const today = new Date();
                  const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  updateFormData('date', futureDate.toISOString().split('T')[0]);
                }}
              >
                <Calendar size={20} color={theme.textSecondary} strokeWidth={2} />
                <Text style={[styles.dateText, { color: formData.date ? theme.text : theme.textSecondary }]}>
                  {formData.date || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Time</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, { backgroundColor: theme.input }]}
                onPress={() => {
                  // Mock time selection
                  updateFormData('time', '2:00 PM');
                }}
              >
                <Clock size={20} color={theme.textSecondary} strokeWidth={2} />
                <Text style={[styles.dateText, { color: formData.time ? theme.text : theme.textSecondary }]}>
                  {formData.time || 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Location & Capacity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Location & Capacity</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Location</Text>
            <View style={[styles.input, styles.inputWithIcon, { backgroundColor: theme.input }]}>
              <MapPin size={20} color={theme.textSecondary} strokeWidth={2} />
              <TextInput
                style={[styles.inputText, { color: theme.text }]}
                placeholder="Enter event location"
                placeholderTextColor={theme.textSecondary}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Capacity</Text>
            <View style={[styles.input, styles.inputWithIcon, { backgroundColor: theme.input }]}>
              <Users size={20} color={theme.textSecondary} strokeWidth={2} />
              <TextInput
                style={[styles.inputText, { color: theme.text }]}
                placeholder="Maximum attendees"
                placeholderTextColor={theme.textSecondary}
                value={formData.capacity.toString()}
                onChangeText={(value) => updateFormData('capacity', parseInt(value) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pricing</Text>
          
          <View style={styles.pricingToggle}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Event Type</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: formData.type === 'free' ? Colors.success[500] : theme.input
                  }
                ]}
                onPress={() => updateFormData('type', 'free')}
              >
                <Text style={[
                  styles.toggleText,
                  { color: formData.type === 'free' ? 'white' : theme.text }
                ]}>
                  Free
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: formData.type === 'paid' ? Colors.primary[500] : theme.input
                  }
                ]}
                onPress={() => updateFormData('type', 'paid')}
              >
                <Text style={[
                  styles.toggleText,
                  { color: formData.type === 'paid' ? 'white' : theme.text }
                ]}>
                  Paid
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {formData.type === 'paid' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Ticket Price</Text>
              <View style={[styles.input, styles.inputWithIcon, { backgroundColor: theme.input }]}>
                <DollarSign size={20} color={theme.textSecondary} strokeWidth={2} />
                <TextInput
                  style={[styles.inputText, { color: theme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.price?.toString() || ''}
                  onChangeText={(value) => updateFormData('price', parseFloat(value) || 0)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
          
          <View style={styles.inputGroup}>
            <View style={[styles.input, styles.inputWithIcon, { backgroundColor: theme.input }]}>
              <Tag size={20} color={theme.textSecondary} strokeWidth={2} />
              <TextInput
                style={[styles.inputText, { color: theme.text }]}
                placeholder="Add a tag"
                placeholderTextColor={theme.textSecondary}
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity onPress={addTag}>
                <Plus size={20} color={Colors.primary[500]} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {formData.tags.length > 0 && (
            <View style={styles.tagContainer}>
              {formData.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: Colors.primary[100] }]}>
                  <Text style={[styles.tagText, { color: Colors.primary[700] }]}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={14} color={Colors.primary[700]} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Create Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: Colors.primary[500],
                opacity: isLoading ? 0.7 : 1,
              }
            ]}
            onPress={handleCreateEvent}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authRequiredText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
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
  pricingToggle: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageUpload: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadContent: {
    alignItems: 'center',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingVertical: 32,
  },
  createButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});