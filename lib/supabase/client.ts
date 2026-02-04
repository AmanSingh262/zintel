// Temporary fallback until @supabase/auth-helpers-nextjs is installed
// Run: npm install @supabase/auth-helpers-nextjs @supabase/supabase-js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Helper function to sign out
export async function signOut() {
    await supabase.auth.signOut()
}
