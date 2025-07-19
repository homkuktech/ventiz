export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          university: string
          major: string
          avatar_url: string | null
          is_verified: boolean
          role: 'student' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          university: string
          major: string
          avatar_url?: string | null
          is_verified?: boolean
          role?: 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          university?: string
          major?: string
          avatar_url?: string | null
          is_verified?: boolean
          role?: 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          current_attendees: number
          cover_image: string
          category: 'academic' | 'social' | 'sports' | 'cultural' | 'career' | 'tech'
          type: 'free' | 'paid'
          price: number | null
          currency: string | null
          organizer_id: string
          organizer_name: string
          organizer_avatar: string | null
          status: 'draft' | 'published' | 'cancelled' | 'completed'
          tags: string[]
          requirements: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          current_attendees?: number
          cover_image: string
          category: 'academic' | 'social' | 'sports' | 'cultural' | 'career' | 'tech'
          type: 'free' | 'paid'
          price?: number | null
          currency?: string | null
          organizer_id: string
          organizer_name: string
          organizer_avatar?: string | null
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          tags?: string[]
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          capacity?: number
          current_attendees?: number
          cover_image?: string
          category?: 'academic' | 'social' | 'sports' | 'cultural' | 'career' | 'tech'
          type?: 'free' | 'paid'
          price?: number | null
          currency?: string | null
          organizer_id?: string
          organizer_name?: string
          organizer_avatar?: string | null
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          tags?: string[]
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string
          user_id: string
          user_name: string
          user_avatar: string | null
          joined_at: string
          ticket_id: string | null
          status: 'registered' | 'attended' | 'cancelled'
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          user_name: string
          user_avatar?: string | null
          joined_at?: string
          ticket_id?: string | null
          status?: 'registered' | 'attended' | 'cancelled'
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          user_name?: string
          user_avatar?: string | null
          joined_at?: string
          ticket_id?: string | null
          status?: 'registered' | 'attended' | 'cancelled'
        }
      }
      event_tickets: {
        Row: {
          id: string
          event_id: string
          user_id: string
          purchase_date: string
          price: number
          currency: string
          payment_intent_id: string
          status: 'pending' | 'paid' | 'refunded' | 'cancelled'
          qr_code: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          purchase_date?: string
          price: number
          currency: string
          payment_intent_id: string
          status?: 'pending' | 'paid' | 'refunded' | 'cancelled'
          qr_code: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          purchase_date?: string
          price?: number
          currency?: string
          payment_intent_id?: string
          status?: 'pending' | 'paid' | 'refunded' | 'cancelled'
          qr_code?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}