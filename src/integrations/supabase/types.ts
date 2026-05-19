export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string | null
          from_city: string | null
          id: string
          message: string | null
          moving_date: string | null
          name: string
          phone: string
          service: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          to_city: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          from_city?: string | null
          id?: string
          message?: string | null
          moving_date?: string | null
          name: string
          phone: string
          service?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          to_city?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          from_city?: string | null
          id?: string
          message?: string | null
          moving_date?: string | null
          name?: string
          phone?: string
          service?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          to_city?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      about_settings: {
        Row: {
          body: string
          cities_covered: string
          created_at: string
          heading: string
          happy_customers: string
          id: number
          updated_at: string
          years_experience: string
        }
        Insert: {
          body?: string
          cities_covered?: string
          created_at?: string
          heading?: string
          happy_customers?: string
          id?: number
          updated_at?: string
          years_experience?: string
        }
        Update: {
          body?: string
          cities_covered?: string
          created_at?: string
          heading?: string
          happy_customers?: string
          id?: number
          updated_at?: string
          years_experience?: string
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          address: string
          created_at: string
          email: string
          id: number
          phone: string
          updated_at: string
          whatsapp: string
          whatsapp_enquiry_message: string
        }
        Insert: {
          address?: string
          created_at?: string
          email?: string
          id?: number
          phone?: string
          updated_at?: string
          whatsapp?: string
          whatsapp_enquiry_message?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: number
          phone?: string
          updated_at?: string
          whatsapp?: string
          whatsapp_enquiry_message?: string
        }
        Relationships: []
      }
      cta_settings: {
        Row: {
          banner_button: string
          banner_link: string
          banner_subtitle: string
          banner_text: string
          created_at: string
          id: number
          show_banner: boolean
          updated_at: string
        }
        Insert: {
          banner_button?: string
          banner_link?: string
          banner_subtitle?: string
          banner_text?: string
          created_at?: string
          id?: number
          show_banner?: boolean
          updated_at?: string
        }
        Update: {
          banner_button?: string
          banner_link?: string
          banner_subtitle?: string
          banner_text?: string
          created_at?: string
          id?: number
          show_banner?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          created_at: string
          description: string
          id: number
          quick_links: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          quick_links?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          quick_links?: string
          updated_at?: string
        }
        Relationships: []
      }
      ga_settings: {
        Row: {
          created_at: string
          ga_measurement_id: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          ga_measurement_id?: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          ga_measurement_id?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      hero_images_settings: {
        Row: {
          about: string
          contact: string
          created_at: string
          gallery: string
          home: string
          id: number
          enquiry: string
          services: string
          updated_at: string
          videos: string
        }
        Insert: {
          about?: string
          contact?: string
          created_at?: string
          gallery?: string
          home?: string
          id?: number
          enquiry?: string
          services?: string
          updated_at?: string
          videos?: string
        }
        Update: {
          about?: string
          contact?: string
          created_at?: string
          gallery?: string
          home?: string
          id?: number
          enquiry?: string
          services?: string
          updated_at?: string
          videos?: string
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          badge: string
          created_at: string
          cta: string
          id: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string
          created_at?: string
          cta?: string
          id?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          badge?: string
          created_at?: string
          cta?: string
          id?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_faqs_settings: {
        Row: {
          content: Json | null
          created_at: string
          eyebrow: string | null
          id: number
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "home_faqs_items"
            referencedColumns: ["home_faqs_settings_id"]
          }
        ]
      }
      home_why_us_settings: {
        Row: {
          content: Json | null
          created_at: string
          eyebrow: string | null
          id: number
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "home_why_us_items"
            referencedColumns: ["home_why_us_settings_id"]
          }
        ]
      }
      home_process_settings: {
        Row: {
          content: Json | null
          created_at: string
          eyebrow: string | null
          id: number
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          eyebrow?: string | null
          id?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "home_process_items"
            referencedColumns: ["home_process_settings_id"]
          }
        ]
      }
      home_faqs_items: {
        Row: {
          answer: string
          created_at: string
          home_faqs_settings_id: number
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          created_at?: string
          home_faqs_settings_id: number
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          home_faqs_settings_id?: number
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_faqs_settings_id"]
            isOneToOne: false
            referencedRelation: "home_faqs_settings"
            referencedColumns: ["id"]
          }
        ]
      }
      home_process_items: {
        Row: {
          created_at: string
          description: string
          home_process_settings_id: number
          id: string
          sort_order: number
          step: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          home_process_settings_id: number
          id?: string
          sort_order?: number
          step?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          home_process_settings_id?: number
          id?: string
          sort_order?: number
          step?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_process_settings_id"]
            isOneToOne: false
            referencedRelation: "home_process_settings"
            referencedColumns: ["id"]
          }
        ]
      }
      home_why_us_items: {
        Row: {
          created_at: string
          description: string
          home_why_us_settings_id: number
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          home_why_us_settings_id: number
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          home_why_us_settings_id?: number
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_why_us_settings_id"]
            isOneToOne: false
            referencedRelation: "home_why_us_settings"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_default_settings: {
        Row: {
          created_at: string
          id: number
          og_image: string
          site_description: string
          site_keywords: string
          site_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          og_image?: string
          site_description?: string
          site_keywords?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          og_image?: string
          site_description?: string
          site_keywords?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_page_settings: {
        Row: {
          created_at: string
          description: string
          id: number
          keywords: string
          og_image: string
          page_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          keywords?: string
          og_image?: string
          page_key?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          keywords?: string
          og_image?: string
          page_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_settings: {
        Row: {
          created_at: string
          facebook: string
          id: number
          instagram: string
          updated_at: string
          youtube: string
        }
        Insert: {
          created_at?: string
          facebook?: string
          id?: number
          instagram?: string
          updated_at?: string
          youtube?: string
        }
        Update: {
          created_at?: string
          facebook?: string
          id?: number
          instagram?: string
          updated_at?: string
          youtube?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_active: boolean
          location: string | null
          message: string
          name: string
          rating: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          message: string
          name: string
          rating?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          message?: string
          name?: string
          rating?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      home_why_us_items: {
        Row: {
          created_at: string
          description: string
          home_why_us_settings_id: number
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          home_why_us_settings_id: number
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          home_why_us_settings_id?: number
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_why_us_settings_id"]
            isOneToOne: false
            referencedRelation: "home_why_us_settings"
            referencedColumns: ["id"]
          }
        ]
      }
      home_process_items: {
        Row: {
          created_at: string
          description: string
          home_process_settings_id: number
          id: string
          sort_order: number
          step: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          home_process_settings_id: number
          id?: string
          sort_order?: number
          step?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          home_process_settings_id?: number
          id?: string
          sort_order?: number
          step?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_process_settings_id"]
            isOneToOne: false
            referencedRelation: "home_process_settings"
            referencedColumns: ["id"]
          }
        ]
      }
      home_faqs_items: {
        Row: {
          answer: string
          created_at: string
          home_faqs_settings_id: number
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          created_at?: string
          home_faqs_settings_id: number
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          home_faqs_settings_id?: number
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            columns: ["home_faqs_settings_id"]
            isOneToOne: false
            referencedRelation: "home_faqs_settings"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin"
      enquiry_status: "new" | "contacted" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
      enquiry_status: ["new", "contacted", "closed"],
    },
  },
} as const
