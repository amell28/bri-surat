import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialUsersList } from '../data/initialUsersData'
import { initSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import { hashPassword, verifyPassword } from '../lib/crypto'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Clear any old legacy localStorage user to ensure opening starts fresh at login
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bri_surat_current_user')
  }

  // Active user session in current browser tab
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('bri_surat_current_user')
      if (activeSession) {
        try {
          return JSON.parse(activeSession)
        } catch (e) {
          return null
        }
      }
    }
    return null
  })

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState(initialUsersList)

  // Fetch users directly from Supabase staf_pengguna table
  const fetchUsersFromSupabase = useCallback(async () => {
    const client = initSupabaseClient()
    if (!client) return

    try {
      const { data, error } = await client
        .from('staf_pengguna')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setUsers(data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('bri_surat_users', JSON.stringify(data))
        }
      }
    } catch (err) {
      console.warn('Gagal memuat staf_pengguna dari Supabase:', err)
    }
  }, [])

  useEffect(() => {
    fetchUsersFromSupabase()
  }, [fetchUsersFromSupabase])

  // Sync active user to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        sessionStorage.setItem('bri_surat_current_user', JSON.stringify(user))
      } else {
        sessionStorage.removeItem('bri_surat_current_user')
      }
    }
  }, [user])

  // ==========================================
  // REAL SUPABASE REGISTER
  // Menyimpan langsung ke tabel 'staf_pengguna' di Supabase
  // ==========================================
  const register = async (formData) => {
    setLoading(true)
    const client = initSupabaseClient()

    const rawPassword = formData.password || '123456'
    const encryptedPassword = await hashPassword(rawPassword)

    const newStaff = {
      id: `USR-${Date.now()}`,
      nama: formData.nama.trim(),
      pn: formData.pn?.trim() || '00' + Math.floor(100000 + Math.random() * 900000),
      email: formData.email.trim().toLowerCase(),
      password: encryptedPassword, // Password tersimpan dalam bentuk terenkripsi SHA-256
      jabatan: formData.jabatan || 'Staff Administrasi Kredit',
      role: formData.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      telepon: formData.telepon?.trim() || '-',
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    }

    try {
      if (client) {
        // 1. Simpan baris baru ke tabel staf_pengguna di Supabase (password terenkripsi)
        const { data: dbData, error: dbError } = await client
          .from('staf_pengguna')
          .insert([newStaff])
          .select()

        if (dbError) {
          console.error('Error insert staf_pengguna di Supabase:', dbError.message)
          if (dbError.message.includes('unique') || dbError.message.includes('duplicate')) {
            return { success: false, message: 'Email atau PN ini sudah terdaftar di Supabase!' }
          }
          return { success: false, message: dbError.message }
        }

        // 2. Daftarkan juga ke Supabase Auth (auth.users yang otomatis terenkripsi bcrypt)
        try {
          await client.auth.signUp({
            email: newStaff.email,
            password: rawPassword,
            options: {
              data: {
                nama: newStaff.nama,
                pn: newStaff.pn,
                jabatan: newStaff.jabatan,
                role: newStaff.role
              }
            }
          })
        } catch (authErr) {
          console.warn('Supabase Auth signUp note:', authErr.message)
        }

        // 3. Update state lokal
        const createdUser = dbData && dbData.length > 0 ? dbData[0] : newStaff
        setUsers((prev) => [createdUser, ...prev.filter((u) => u.email !== createdUser.email)])
        setUser(createdUser)

        return {
          success: true,
          user: createdUser,
          message: 'Berhasil mendaftar! Akun terenkripsi dan tersimpan di Supabase.'
        }
      } else {
        // Fallback jika offline
        setUsers((prev) => [newStaff, ...prev])
        setUser(newStaff)
        return { success: true, user: newStaff }
      }
    } catch (err) {
      return { success: false, message: err.message || 'Gagal mendaftar ke Supabase.' }
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // REAL SUPABASE LOGIN
  // Memeriksa password terenkripsi ke tabel 'staf_pengguna' di Supabase
  // ==========================================
  const login = async (identifier, password) => {
    setLoading(true)
    const client = initSupabaseClient()
    const cleanId = (identifier || '').trim().toLowerCase()
    const inputPassword = (password || '').trim()

    try {
      if (!cleanId) {
        return { success: false, message: 'Harap masukkan Personal Number (PN) atau Email Anda.' }
      }
      if (!inputPassword) {
        return { success: false, message: 'Harap masukkan password Anda.' }
      }

      if (client) {
        // 1. Cek langsung ke tabel staf_pengguna di Supabase berdasarkan Email ATAU PN
        const { data, error } = await client
          .from('staf_pengguna')
          .select('*')
          .or(`email.ilike.${cleanId},pn.ilike.${cleanId}`)
          .limit(1)

        if (!error && data && data.length > 0) {
          const matched = data[0]

          // Verifikasi password terenkripsi SHA-256 (dengan fallback plain text jika belum terenkripsi)
          const isMatch = await verifyPassword(inputPassword, matched.password)
          if (!isMatch) {
            return { success: false, message: 'Password salah untuk akun staf ini.' }
          }

          setUser(matched)
          return { success: true, user: matched, source: 'supabase_table' }
        }

        // 2. Cek juga ke Supabase Auth signInWithPassword jika didaftarkan via Auth
        try {
          const { data: authData, error: authError } = await client.auth.signInWithPassword({
            email: cleanId.includes('@') ? cleanId : `${cleanId}@bri.co.id`,
            password: inputPassword
          })

          if (!authError && authData?.user) {
            const meta = authData.user.user_metadata || {}
            const authProfile = {
              id: authData.user.id,
              nama: meta.nama || authData.user.email?.split('@')[0],
              pn: meta.pn || cleanId,
              email: authData.user.email,
              jabatan: meta.jabatan || 'Staff Administrasi Kredit',
              role: meta.role || 'Staff',
              unit: 'KCP Iskandar Palembang',
              status: 'Aktif'
            }
            setUser(authProfile)
            return { success: true, user: authProfile, source: 'supabase_auth' }
          }
        } catch (e) {
          // ignore
        }
      }

      // 3. Fallback akun staf lokal bawaan (jika offline)
      const matchedLocal = users.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.pn.toLowerCase() === cleanId
      )

      if (matchedLocal) {
        const isMatch = await verifyPassword(
          inputPassword,
          matchedLocal.password || '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a'
        )
        if (!isMatch) {
          return { success: false, message: 'Password salah untuk akun staf ini.' }
        }
        setUser(matchedLocal)
        return { success: true, user: matchedLocal, source: 'local' }
      }

      return {
        success: false,
        message: 'Personal Number (PN) atau Email tidak terdaftar di sistem.'
      }
    } catch (err) {
      return { success: false, message: err.message || 'Gagal login ke database.' }
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const logout = async () => {
    const client = initSupabaseClient()
    if (client) {
      try {
        await client.auth.signOut()
      } catch (e) {
        console.warn('SignOut error:', e)
      }
    }
    setUser(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bri_surat_current_user')
      localStorage.removeItem('bri_surat_current_user')
    }
  }

  // Tambah staf dari halaman /users langsung ke Supabase
  const addUser = async (userData) => {
    const client = initSupabaseClient()
    const encryptedPassword = await hashPassword('123456')
    const newStaff = {
      id: `USR-${Date.now()}`,
      nama: userData.nama.trim(),
      pn: userData.pn.trim(),
      email: userData.email.trim().toLowerCase(),
      password: encryptedPassword,
      jabatan: userData.jabatan,
      role: userData.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      telepon: userData.telepon?.trim() || '-',
      status: userData.status || 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    }

    if (client) {
      try {
        await client.from('staf_pengguna').insert([newStaff])
      } catch (err) {
        console.warn('Gagal insert staf_pengguna ke Supabase:', err)
      }
    }

    setUsers((prev) => [newStaff, ...prev])
    return newStaff
  }

  // Hapus staf dari Supabase
  const deleteUser = async (userId) => {
    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').delete().eq('id', userId)
      } catch (err) {
        console.warn('Gagal delete staf_pengguna di Supabase:', err)
      }
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const updateProfile = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').update(updatedData).eq('id', user.id)
      } catch (err) {
        console.warn('Update staf_pengguna error:', err)
      }
    }

    return { success: true }
  }

  // Role permissions
  const roleName = (user?.role || '').toLowerCase()
  const isAdmin = roleName === 'admin' || roleName === 'supervisor'
  const isStaff = !isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        isAdmin,
        isStaff,
        login,
        register,
        logout,
        updateProfile,
        addUser,
        deleteUser,
        fetchUsersFromSupabase
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
