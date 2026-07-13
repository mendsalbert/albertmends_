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
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          date: string;
          read_time: string;
          category: string;
          year: string;
          upvotes: number;
          tags: string[];
          author: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          content?: string;
          date?: string;
          read_time?: string;
          category?: string;
          year?: string;
          upvotes?: number;
          tags?: string[];
          author?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          date?: string;
          read_time?: string;
          category?: string;
          year?: string;
          upvotes?: number;
          tags?: string[];
          author?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guestbook_entries: {
        Row: {
          id: string;
          name: string;
          message: string;
          signature: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          message?: string;
          signature: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          message?: string;
          signature?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          src: string;
          type: "image" | "video";
          caption: string | null;
          date: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          src: string;
          type: "image" | "video";
          caption?: string | null;
          date?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          src?: string;
          type?: "image" | "video";
          caption?: string | null;
          date?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_blog_upvotes: {
        Args: { post_slug: string };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
