// Temporary fallback until @supabase/auth-helpers-nextjs is installed
// Run: npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    return createClient(supabaseUrl, supabaseAnonKey)
}

// Helper to get session on server
export async function getServerSession() {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

// Helper to get user on server
export async function getServerUser() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
