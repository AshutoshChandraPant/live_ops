import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let clientSingleton: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (clientSingleton) return clientSingleton
  clientSingleton = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return clientSingleton
}
