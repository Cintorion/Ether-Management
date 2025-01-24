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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'draft' | 'active' | 'completed' | 'on_hold' | 'cancelled'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'draft' | 'active' | 'completed' | 'on_hold' | 'cancelled'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'active' | 'completed' | 'on_hold' | 'cancelled'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      canvas_models: {
        Row: {
          id: string
          project_id: string
          key_partners: string | null
          key_activities: string | null
          key_resources: string | null
          value_propositions: string | null
          customer_relationships: string | null
          channels: string | null
          customer_segments: string | null
          cost_structure: string | null
          revenue_streams: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          key_partners?: string | null
          key_activities?: string | null
          key_resources?: string | null
          value_propositions?: string | null
          customer_relationships?: string | null
          channels?: string | null
          customer_segments?: string | null
          cost_structure?: string | null
          revenue_streams?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          key_partners?: string | null
          key_activities?: string | null
          key_resources?: string | null
          value_propositions?: string | null
          customer_relationships?: string | null
          channels?: string | null
          customer_segments?: string | null
          cost_structure?: string | null
          revenue_streams?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'completed' | 'blocked'
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed' | 'blocked'
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed' | 'blocked'
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mvp_hypotheses: {
        Row: {
          id: string
          project_id: string
          hypothesis: string
          status: 'unverified' | 'verified' | 'rejected'
          test_method: string | null
          results: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          hypothesis: string
          status?: 'unverified' | 'verified' | 'rejected'
          test_method?: string | null
          results?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          hypothesis?: string
          status?: 'unverified' | 'verified' | 'rejected'
          test_method?: string | null
          results?: string | null
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
  }
} 