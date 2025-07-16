import { Event, CreateEventData, EventTicket, PaymentIntent } from '@/types/events';
import { useAuth } from '@/contexts/AuthContext';

// Mock API service - replace with actual API calls
class EventService {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  async createEvent(eventData: CreateEventData): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (!eventData.title || !eventData.description || !eventData.date) {
        throw new Error('Required fields are missing');
      }

      if (eventData.type === 'paid' && (!eventData.price || eventData.price <= 0)) {
        throw new Error('Price is required for paid events');
      }

      // Mock successful event creation
      const newEvent: Event = {
        id: 'event_' + Date.now(),
        ...eventData,
        currentAttendees: 0,
        organizerId: 'current_user_id',
        organizerName: 'Current User',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attendees: [],
        tickets: [],
      };

      return { success: true, event: newEvent };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  }

  async joinFreeEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock capacity check
      const event = await this.getEvent(eventId);
      if (event && event.currentAttendees >= event.capacity) {
        throw new Error('Event is at full capacity');
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join event'
      };
    }
  }

  async createPaymentIntent(eventId: string, amount: number): Promise<{ success: boolean; paymentIntent?: PaymentIntent; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock payment intent creation
      const paymentIntent: PaymentIntent = {
        id: 'pi_' + Date.now(),
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        status: 'requires_payment_method',
        clientSecret: 'pi_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9),
      };

      return { success: true, paymentIntent };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent'
      };
    }
  }

  async purchaseTicket(eventId: string, paymentIntentId: string): Promise<{ success: boolean; ticket?: EventTicket; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const event = await this.getEvent(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.currentAttendees >= event.capacity) {
        throw new Error('Event is sold out');
      }

      // Mock ticket creation
      const ticket: EventTicket = {
        id: 'ticket_' + Date.now(),
        eventId,
        userId: 'current_user_id',
        purchaseDate: new Date().toISOString(),
        price: event.price || 0,
        currency: event.currency || 'usd',
        paymentIntentId,
        status: 'paid',
        qrCode: 'qr_' + Date.now(),
      };

      return { success: true, ticket };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase ticket'
      };
    }
  }

  async getEvent(eventId: string): Promise<Event | null> {
    // Mock event retrieval
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock event data
    return {
      id: eventId,
      title: 'Sample Event',
      description: 'Sample event description',
      date: '2024-03-20',
      time: '2:00 PM',
      location: 'Main Hall',
      capacity: 100,
      currentAttendees: 45,
      coverImage: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      category: 'academic',
      type: 'paid',
      price: 25,
      currency: 'usd',
      organizerId: 'organizer_123',
      organizerName: 'Event Organizer',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['workshop', 'technology'],
      attendees: [],
      tickets: [],
    };
  }

  async getUserEvents(userId: string): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Mock empty array
  }

  async getUserTickets(userId: string): Promise<EventTicket[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Mock empty array
  }

  async cancelEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel event'
      };
    }
  }
}

export const eventService = new EventService();