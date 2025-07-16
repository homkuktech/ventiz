export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentAttendees: number;
  coverImage: string;
  category: 'academic' | 'social' | 'sports' | 'cultural' | 'career' | 'tech';
  type: 'free' | 'paid';
  price?: number;
  currency?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  requirements?: string[];
  isLiked?: boolean;
  attendees: EventAttendee[];
  tickets?: EventTicket[];
}

export interface EventAttendee {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: string;
  ticketId?: string;
  status: 'registered' | 'attended' | 'cancelled';
}

export interface EventTicket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  price: number;
  currency: string;
  paymentIntentId: string;
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  qrCode: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  coverImage: string;
  category: Event['category'];
  type: 'free' | 'paid';
  price?: number;
  currency?: string;
  tags: string[];
  requirements?: string[];
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}