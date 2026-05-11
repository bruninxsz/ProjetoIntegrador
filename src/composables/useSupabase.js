import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const session = ref(null)
export const loadingSession = ref(true)
 
supabase.auth.getSession().then(({ data }) => {
session.value = data.session
loadingSession.value = false
})

supabase.auth.onAuthStateChange((_event, newSession) => {
session.value = newSession
})
 
export function useSupabase() {
return {
supabase,
session,
loadingSession
}
}
 