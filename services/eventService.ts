import { Event, CreateEventData, EventTicket, PaymentIntent } from '@/types/events';
import { supabase } from '@/lib/supabase';

class EventService {
  async createEvent(eventData: CreateEventData): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          capacity: eventData.capacity,
          cover_image: eventData.coverImage,
          category: eventData.category,
          type: eventData.type,
          price: eventData.price,
          currency: eventData.currency,
          organizer_id: user.id,
          organizer_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
          organizer_avatar: profile?.avatar_url,
          tags: eventData.tags,
          requirements: eventData.requirements,
          status: 'published',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const event: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        capacity: data.capacity,
        currentAttendees: data.current_attendees,
        coverImage: data.cover_image,
        category: data.category,
        type: data.type,
        price: data.price,
        currency: data.currency,
        organizerId: data.organizer_id,
        organizerName: data.organizer_name,
        organizerAvatar: data.organizer_avatar,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        tags: data.tags,
        requirements: data.requirements,
        attendees: [],
        tickets: [],
      };

      return { success: true, event };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attendees(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        capacity: event.capacity,
        currentAttendees: event.current_attendees,
        coverImage: event.cover_image,
        category: event.category,
        type: event.type,
        price: event.price,
        currency: event.currency,
        organizerId: event.organizer_id,
        organizerName: event.organizer_name,
        organizerAvatar: event.organizer_avatar,
        status: event.status,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        tags: event.tags,
        requirements: event.requirements,
        attendees: event.event_attendees.map((attendee: any) => ({
          id: attendee.id,
          userId: attendee.user_id,
          userName: attendee.user_name,
          userAvatar: attendee.user_avatar,
          joinedAt: attendee.joined_at,
          ticketId: attendee.ticket_id,
          status: attendee.status,
        })),
        tickets: [],
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEvent(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attendees(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        capacity: data.capacity,
        currentAttendees: data.current_attendees,
        coverImage: data.cover_image,
        category: data.category,
        type: data.type,
        price: data.price,
        currency: data.currency,
        organizerId: data.organizer_id,
        organizerName: data.organizer_name,
        organizerAvatar: data.organizer_avatar,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        tags: data.tags,
        requirements: data.requirements,
        attendees: data.event_attendees.map((attendee: any) => ({
          id: attendee.id,
          userId: attendee.user_id,
          userName: attendee.user_name,
          userAvatar: attendee.user_avatar,
          joinedAt: attendee.joined_at,
          ticketId: attendee.ticket_id,
          status: attendee.status,
        })),
        tickets: [],
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async joinFreeEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Check if user is already registered
      const { data: existingAttendee } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingAttendee) {
        throw new Error('You are already registered for this event');
      }

      // Check event capacity
      const { data: event } = await supabase
        .from('events')
        .select('capacity, current_attendees')
        .eq('id', eventId)
        .single();

      if (event && event.current_attendees >= event.capacity) {
        throw new Error('Event is at full capacity');
      }

      // Add attendee
      const { error: attendeeError } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
          user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
          user_avatar: profile?.avatar_url,
          status: 'registered',
        });

      if (attendeeError) {
        throw new Error(attendeeError.message);
      }

      // Update event attendee count
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          current_attendees: (event?.current_attendees || 0) + 1 
        })
        .eq('id', eventId);

      if (updateError) {
        throw new Error(updateError.message);
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
      // Mock payment intent creation for now
      // In a real app, you would integrate with Stripe or another payment processor
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const event = await this.getEvent(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.currentAttendees >= event.capacity) {
        throw new Error('Event is sold out');
      }

      // Create ticket record
      const { data: ticketData, error: ticketError } = await supabase
        .from('event_tickets')
        .insert({
          event_id: eventId,
          user_id: user.id,
          price: event.price || 0,
          currency: event.currency || 'usd',
          payment_intent_id: paymentIntentId,
          status: 'paid',
          qr_code: 'qr_' + Date.now(),
        })
        .select()
        .single();

      if (ticketError) {
        throw new Error(ticketError.message);
      }

      // Add to attendees
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      const { error: attendeeError } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
          user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
          user_avatar: profile?.avatar_url,
          ticket_id: ticketData.id,
          status: 'registered',
        });

      if (attendeeError) {
        throw new Error(attendeeError.message);
      }

      // Update event attendee count
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          current_attendees: event.currentAttendees + 1 
        })
        .eq('id', eventId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const ticket: EventTicket = {
        id: ticketData.id,
        eventId: ticketData.event_id,
        userId: ticketData.user_id,
        purchaseDate: ticketData.purchase_date,
        price: ticketData.price,
        currency: ticketData.currency,
        paymentIntentId: ticketData.payment_intent_id,
        status: ticketData.status,
        qrCode: ticketData.qr_code,
      };

      return { success: true, ticket };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase ticket'
      };
    }
  }

  async getUserEvents(userId: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        capacity: event.capacity,
        currentAttendees: event.current_attendees,
        coverImage: event.cover_image,
        category: event.category,
        type: event.type,
        price: event.price,
        currency: event.currency,
        organizerId: event.organizer_id,
        organizerName: event.organizer_name,
        organizerAvatar: event.organizer_avatar,
        status: event.status,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        tags: event.tags,
        requirements: event.requirements,
        attendees: [],
        tickets: [],
      }));
    } catch (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
  }

  async getUserTickets(userId: string): Promise<EventTicket[]> {
    try {
      const { data, error } = await supabase
        .from('event_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        userId: ticket.user_id,
        purchaseDate: ticket.purchase_date,
        price: ticket.price,
        currency: ticket.currency,
        paymentIntentId: ticket.payment_intent_id,
        status: ticket.status,
        qrCode: ticket.qr_code,
      }));
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return [];
    }
  }

  async cancelEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', eventId);

      if (error) {
        throw new Error(error.message);
      }

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