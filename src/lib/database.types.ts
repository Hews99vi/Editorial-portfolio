// Placeholder types - will be generated from Supabase schema
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
                    title: string
                    slug: string
                    summary: string
                    problem: string
                    approach: string
                    outcome: string
                    metrics: Json
                    tags: string[]
                    tech_stack: string[]
                    role: string
                    timeline: string
                    images: Json
                    live_url: string | null
                    github_url: string | null
                    featured: boolean
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['projects']['Insert']>
            }
            client_portfolios: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    client_name: string
                    client_logo_url: string | null
                    intro_message: string
                    why_fit_bullets: string[]
                    accent_preset: string
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['client_portfolios']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['client_portfolios']['Insert']>
            }
            portfolio_projects: {
                Row: {
                    portfolio_id: string
                    project_id: string
                    sort_order: number
                }
                Insert: Database['public']['Tables']['portfolio_projects']['Row']
                Update: Partial<Database['public']['Tables']['portfolio_projects']['Insert']>
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    status: 'new' | 'archived'
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
            }
            site_settings: {
                Row: {
                    id: string
                    display_name: string
                    headline: string
                    subheadline: string
                    socials: Json
                    upwork_link: string | null
                    fiverr_link: string | null
                    calendly_link: string | null
                    default_seo_title: string
                    default_seo_description: string
                }
                Insert: Partial<Database['public']['Tables']['site_settings']['Row']>
                Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
            }
        }
    }
}
