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
          name: string
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          phone: string | null
          birth_date: string | null
          address: string | null
          registration_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          registration_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          registration_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          client_id: string
          session_date: string
          content: string
          future_plan: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          session_date: string
          content: string
          future_plan?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          session_date?: string
          content?: string
          future_plan?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
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
