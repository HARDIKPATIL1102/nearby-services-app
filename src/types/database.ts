export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          category_id: string;
          location: string;
          description: string;
          rating: string;
          price_range: string;
          phone: string | null;
          whatsapp: string | null;
          availability: string;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          category_id: string;
          location?: string;
          description?: string;
          rating?: string;
          price_range?: string;
          phone?: string | null;
          whatsapp?: string | null;
          availability?: string;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          category_id?: string;
          location?: string;
          description?: string;
          rating?: string;
          price_range?: string;
          phone?: string | null;
          whatsapp?: string | null;
          availability?: string;
          verified?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "providers_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string;
          category_id: string;
          price: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description?: string;
          category_id: string;
          price: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          title?: string;
          description?: string;
          category_id?: string;
          price?: string;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey";
            columns: ["provider_id"];
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "services_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          address: string;
          notes: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          provider_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          address: string;
          notes?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          provider_id?: string;
          service_id?: string;
          booking_date?: string;
          booking_time?: string;
          address?: string;
          notes?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_provider_id_fkey";
            columns: ["provider_id"];
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          provider_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_provider_id_fkey";
            columns: ["provider_id"];
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      provider_review_counts: {
        Args: { pids: string[] };
        Returns: { provider_id: string; review_count: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type PublicTable = keyof Database["public"]["Tables"];

export type TableRow<T extends PublicTable> =
  Database["public"]["Tables"][T]["Row"];

export type TableInsert<T extends PublicTable> =
  Database["public"]["Tables"][T]["Insert"];

export type TableUpdate<T extends PublicTable> =
  Database["public"]["Tables"][T]["Update"];
