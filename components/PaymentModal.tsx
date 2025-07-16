import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { CreditCard, X, Shield, DollarSign } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/events';
import { eventService } from '@/services/eventService';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
}

export function PaymentModal({ visible, onClose, event, onSuccess }: PaymentModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Create payment intent
      const paymentResult = await eventService.createPaymentIntent(event.id, event.price || 0);
      
      if (!paymentResult.success || !paymentResult.paymentIntent) {
        throw new Error(paymentResult.error || 'Failed to create payment');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Purchase ticket
      const ticketResult = await eventService.purchaseTicket(event.id, paymentResult.paymentIntent.id);
      
      if (ticketResult.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          setStep('details');
        }, 2000);
      } else {
        throw new Error(ticketResult.error || 'Failed to purchase ticket');
      }
    } catch (error) {
      Alert.alert('Payment Failed', error instanceof Error ? error.message : 'Payment processing failed');
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setStep('details');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>
          {step === 'details' && (
            <>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>
                  Purchase Ticket
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={24} color={theme.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: theme.text }]}>
                  {event.title}
                </Text>
                <Text style={[styles.eventDetails, { color: theme.textSecondary }]}>
                  {event.date} • {event.time}
                </Text>
                <Text style={[styles.eventLocation, { color: theme.textSecondary }]}>
                  {event.location}
                </Text>
              </View>

              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.text }]}>
                    Ticket Price
                  </Text>
                  <Text style={[styles.priceValue, { color: theme.text }]}>
                    ${event.price?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.text }]}>
                    Service Fee
                  </Text>
                  <Text style={[styles.priceValue, { color: theme.text }]}>
                    $2.50
                  </Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={[styles.totalLabel, { color: theme.text }]}>
                    Total
                  </Text>
                  <Text style={[styles.totalValue, { color: Colors.primary[500] }]}>
                    ${((event.price || 0) + 2.50).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.securityInfo}>
                <Shield size={16} color={Colors.success[500]} strokeWidth={2} />
                <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                  Secure payment powered by Stripe
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.payButton, { backgroundColor: Colors.primary[500] }]}
                onPress={handlePayment}
                disabled={isProcessing}
              >
                <CreditCard size={20} color="white" strokeWidth={2} />
                <Text style={styles.payButtonText}>
                  Pay ${((event.price || 0) + 2.50).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'processing' && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors.primary[500]} />
              <Text style={[styles.processingText, { color: theme.text }]}>
                Processing Payment...
              </Text>
              <Text style={[styles.processingSubtext, { color: theme.textSecondary }]}>
                Please don't close this window
              </Text>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.successContainer}>
              <View style={[styles.successIcon, { backgroundColor: Colors.success[100] }]}>
                <Text style={styles.successEmoji}>🎉</Text>
              </View>
              <Text style={[styles.successTitle, { color: theme.text }]}>
                Payment Successful!
              </Text>
              <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
                Your ticket has been purchased successfully
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.neutral[200],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    marginBottom: 0,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});