export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * Hand-written subset of the schema in supabase/migrations/0001_create_reports.sql
 * and 0002_add_tiers_and_remedies.sql. Kept minimal (just the `reports`
 * table) rather than generated, since that's all this app currently
 * reads or writes.
 */
export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          created_at: string;
          child_name: string;
          dob: string;
          birth_time: string;
          time_unknown: boolean;
          place_label: string;
          latitude: number;
          longitude: number;
          chart: Json;
          insights: Json;
          pathway: Json | null;
          remedies: Json | null;
          meta: Json;
          tier: "full" | "premium" | null;
          stripe_checkout_session_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          child_name: string;
          dob: string;
          birth_time: string;
          time_unknown?: boolean;
          place_label: string;
          latitude: number;
          longitude: number;
          chart: Json;
          insights: Json;
          pathway?: Json | null;
          remedies?: Json | null;
          meta: Json;
          tier?: "full" | "premium" | null;
          stripe_checkout_session_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
