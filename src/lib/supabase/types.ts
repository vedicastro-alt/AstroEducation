export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * Hand-written subset of the schema in supabase/migrations/0001_create_reports.sql
 * through 0005_add_career_deep_dive.sql. Kept minimal (just the tables this
 * app actually reads or writes) rather than generated.
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
          career_deep_dive: Json | null;
          meta: Json;
          tier: "full" | "premium" | null;
          stripe_checkout_session_id: string | null;
          customer_email: string | null;
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
          career_deep_dive?: Json | null;
          meta: Json;
          tier?: "full" | "premium" | null;
          stripe_checkout_session_id?: string | null;
          customer_email?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
      gift_vouchers: {
        Row: {
          id: string;
          code: string;
          tier: "full" | "premium";
          buyer_email: string | null;
          recipient_email: string;
          recipient_name: string | null;
          gift_message: string | null;
          status: "pending" | "paid" | "redeemed";
          stripe_checkout_session_id: string | null;
          redeemed_report_id: string | null;
          redeemed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code?: string;
          tier: "full" | "premium";
          buyer_email?: string | null;
          recipient_email: string;
          recipient_name?: string | null;
          gift_message?: string | null;
          status?: "pending" | "paid" | "redeemed";
          stripe_checkout_session_id?: string | null;
          redeemed_report_id?: string | null;
          redeemed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gift_vouchers"]["Insert"]>;
        Relationships: [];
      };
      report_feedback: {
        Row: {
          id: string;
          report_id: string;
          tier: "full" | "premium";
          rating: number | null;
          message: string | null;
          ok_to_feature: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          tier: "full" | "premium";
          rating?: number | null;
          message?: string | null;
          ok_to_feature?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["report_feedback"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
