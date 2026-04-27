export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      operators: {
        Row: {
          id: string
          email: string
          business_name: string
          slug: string
          phone: string | null
          logo_url: string | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          venmo_handle: string | null
          zelle_info: string | null
          cashapp_handle: string | null
          default_deposit_percent: number
          default_tax_rate: number
          quote_expiration_days: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          business_name: string
          slug: string
          phone?: string | null
          logo_url?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          venmo_handle?: string | null
          zelle_info?: string | null
          cashapp_handle?: string | null
          default_deposit_percent?: number
          default_tax_rate?: number
          quote_expiration_days?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          business_name?: string
          slug?: string
          phone?: string | null
          logo_url?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          venmo_handle?: string | null
          zelle_info?: string | null
          cashapp_handle?: string | null
          default_deposit_percent?: number
          default_tax_rate?: number
          quote_expiration_days?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          operator_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          source: string | null
          referred_by_client_id: string | null
          dietary_restrictions: Json
          preferences: Json
          notes: string | null
          total_revenue: number
          event_count: number
          last_event_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          source?: string | null
          referred_by_client_id?: string | null
          dietary_restrictions?: Json
          preferences?: Json
          notes?: string | null
          total_revenue?: number
          event_count?: number
          last_event_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          source?: string | null
          referred_by_client_id?: string | null
          dietary_restrictions?: Json
          preferences?: Json
          notes?: string | null
          total_revenue?: number
          event_count?: number
          last_event_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          operator_id: string
          client_id: string
          status: 'new' | 'viewed' | 'quote_sent' | 'booked' | 'declined'
          event_type: string | null
          event_date: string
          event_time: string | null
          guest_count: number
          location_address: string | null
          service_type: string | null
          budget_range: string | null
          dietary_restrictions: Json
          referral_source: string | null
          additional_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          client_id: string
          status?: 'new' | 'viewed' | 'quote_sent' | 'booked' | 'declined'
          event_type?: string | null
          event_date: string
          event_time?: string | null
          guest_count: number
          location_address?: string | null
          service_type?: string | null
          budget_range?: string | null
          dietary_restrictions?: Json
          referral_source?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          client_id?: string
          status?: 'new' | 'viewed' | 'quote_sent' | 'booked' | 'declined'
          event_type?: string | null
          event_date?: string
          event_time?: string | null
          guest_count?: number
          location_address?: string | null
          service_type?: string | null
          budget_range?: string | null
          dietary_restrictions?: Json
          referral_source?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          operator_id: string
          client_id: string
          inquiry_id: string | null
          status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          event_date: string
          event_time: string | null
          guest_count: number
          location_address: string | null
          service_type: string | null
          total_value: number
          deposit_amount: number
          deposit_paid: boolean
          balance_due: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          client_id: string
          inquiry_id?: string | null
          status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          event_date: string
          event_time?: string | null
          guest_count: number
          location_address?: string | null
          service_type?: string | null
          total_value?: number
          deposit_amount?: number
          deposit_paid?: boolean
          balance_due?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          client_id?: string
          inquiry_id?: string | null
          status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          event_date?: string
          event_time?: string | null
          guest_count?: number
          location_address?: string | null
          service_type?: string | null
          total_value?: number
          deposit_amount?: number
          deposit_paid?: boolean
          balance_due?: number
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          operator_id: string
          event_id: string | null
          inquiry_id: string | null
          client_id: string
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          token: string
          subtotal: number
          fees: number
          discount: number
          tax_rate: number
          tax_amount: number
          total: number
          deposit_percent: number
          deposit_amount: number
          notes: string | null
          expires_at: string | null
          sent_at: string | null
          viewed_at: string | null
          accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          event_id?: string | null
          inquiry_id?: string | null
          client_id: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          token?: string
          subtotal?: number
          fees?: number
          discount?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          deposit_percent?: number
          deposit_amount?: number
          notes?: string | null
          expires_at?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          event_id?: string | null
          inquiry_id?: string | null
          client_id?: string
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
          token?: string
          subtotal?: number
          fees?: number
          discount?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          deposit_percent?: number
          deposit_amount?: number
          notes?: string | null
          expires_at?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_lines: {
        Row: {
          id: string
          quote_id: string
          menu_item_id: string | null
          description: string
          quantity: number
          unit_price: number
          line_total: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          menu_item_id?: string | null
          description: string
          quantity?: number
          unit_price: number
          line_total: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          menu_item_id?: string | null
          description?: string
          quantity?: number
          unit_price?: number
          line_total?: number
          sort_order?: number
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          operator_id: string
          name: string
          category: string | null
          default_price: number | null
          unit: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          name: string
          category?: string | null
          default_price?: number | null
          unit?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          name?: string
          category?: string | null
          default_price?: number | null
          unit?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          operator_id: string
          event_id: string
          quote_id: string | null
          client_id: string
          token: string
          status: 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue'
          amount: number
          deposit_credited: number
          balance_due: number
          paid_amount: number
          due_date: string | null
          sent_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          event_id: string
          quote_id?: string | null
          client_id: string
          token?: string
          status?: 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue'
          amount: number
          deposit_credited?: number
          balance_due: number
          paid_amount?: number
          due_date?: string | null
          sent_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          event_id?: string
          quote_id?: string | null
          client_id?: string
          token?: string
          status?: 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue'
          amount?: number
          deposit_credited?: number
          balance_due?: number
          paid_amount?: number
          due_date?: string | null
          sent_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          operator_id: string
          invoice_id: string | null
          quote_id: string | null
          client_id: string
          payment_type: 'deposit' | 'balance' | 'full'
          payment_method: 'stripe' | 'venmo' | 'zelle' | 'cashapp' | 'cash' | 'check' | 'other'
          amount: number
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          invoice_id?: string | null
          quote_id?: string | null
          client_id: string
          payment_type: 'deposit' | 'balance' | 'full'
          payment_method: 'stripe' | 'venmo' | 'zelle' | 'cashapp' | 'cash' | 'check' | 'other'
          amount: number
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          invoice_id?: string | null
          quote_id?: string | null
          client_id?: string
          payment_type?: 'deposit' | 'balance' | 'full'
          payment_method?: 'stripe' | 'venmo' | 'zelle' | 'cashapp' | 'cash' | 'check' | 'other'
          amount?: number
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          notes?: string | null
          created_at?: string
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
      inquiry_status: 'new' | 'viewed' | 'quote_sent' | 'booked' | 'declined'
      event_status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
      quote_status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'
      invoice_status: 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue'
      payment_type: 'deposit' | 'balance' | 'full'
      payment_method: 'stripe' | 'venmo' | 'zelle' | 'cashapp' | 'cash' | 'check' | 'other'
    }
  }
}
