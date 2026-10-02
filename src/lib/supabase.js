import { createClient } from '@supabase/supabase-js'

// Helper to get active URL & Key (either from .env or localStorage in browser)
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('bri_supabase_url') || '' : ''
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('bri_supabase_anon_key') || '' : ''

  return {
    url: (envUrl || localUrl).trim(),
    anonKey: (envKey || localKey).trim()
  }
}

// Helper to clean URL (removes trailing slashes or /rest/v1 suffix if pasted)
export const cleanSupabaseUrl = (rawUrl) => {
  if (!rawUrl) return ''
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

// Function to initialize client dynamically
export const initSupabaseClient = (customUrl, customKey) => {
  const config = customUrl && customKey ? { url: customUrl, anonKey: customKey } : getSupabaseConfig()
  const cleanedUrl = cleanSupabaseUrl(config.url)

  if (cleanedUrl && config.anonKey) {
    try {
      return createClient(cleanedUrl, config.anonKey)
    } catch (e) {
      console.error('Inisialisasi Supabase gagal:', e)
      return null
    }
  }
  return null
}

export let supabase = initSupabaseClient()

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig()
  return Boolean(config.url && config.anonKey)
}

export const saveSupabaseCredentials = (url, key) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bri_supabase_url', url.trim())
    localStorage.setItem('bri_supabase_anon_key', key.trim())
    supabase = initSupabaseClient(url.trim(), key.trim())
  }
}

export const clearSupabaseCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bri_supabase_url')
    localStorage.removeItem('bri_supabase_anon_key')
    supabase = initSupabaseClient()
  }
}

// Test connection
export const testSupabaseConnection = async () => {
  const client = initSupabaseClient()
  if (!client) {
    return { success: false, message: 'URL atau Anon Key Supabase belum diisi.' }
  }

  try {
    const { data, error } = await client.from('surat_debitur').select('id').limit(1)
    if (error) {
      return { success: false, message: error.message }
    }
    return { success: true, message: 'Koneksi ke tabel surat_debitur berhasil!' }
  } catch (err) {
    return { success: false, message: err.message || 'Koneksi gagal.' }
  }
}
