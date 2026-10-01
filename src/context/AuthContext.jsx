import { createContext, useContext, useState, useEffect } from 'react'
import { initialUsersList } from '../data/initialUsersData'
import { initSupabaseClient, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Load registered users
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('bri_surat_users')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse stored users', e)
      }
    }
    return initialUsersList
  })

  // Start with user = null so website ALWAYS opens directly to Login screen on first visit
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bri_surat_current_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse current user', e)
      }
    }
    // Default to null so user goes directly to Login
    return null
  })

  const [supabaseReady, setSupabaseReady] = useState(isSupabaseConfigured())

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured())
  }, [])

  useEffect(() => {
    localStorage.setItem('bri_surat_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user) {
      localStorage.setItem('bri_surat_current_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bri_surat_current_user')
    }
  }, [user])

  // Login handler connected to Supabase
  const login = async (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase()

    // 1. Try to query Supabase staf_pengguna table first
    const client = initSupabaseClient()
    if (client) {
      try {
        const { data, error } = await client
          .from('staf_pengguna')
          .select('*')
          .or(`email.ilike.${cleanId},pn.ilike.${cleanId}`)
          .limit(1)

        if (!error && data && data.length > 0) {
          const found = data[0]
          setUser(found)
          return { success: true, user: found, source: 'supabase' }
        }
      } catch (err) {
        console.warn('Supabase auth fallback:', err)
      }
    }

    // 2. Fallback to local staff list
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.pn.toLowerCase() === cleanId
    )

    if (found) {
      setUser(found)

      // Try background sync to Supabase if table is created
      if (client) {
        try {
          await client.from('staf_pengguna').upsert([found], { onConflict: 'id' })
        } catch (e) {
          // ignore background sync error
        }
      }

      return { success: true, user: found, source: 'local' }
    } else {
      // Dynamic staff login for demo
      const demoUser = {
        id: `USR-${Date.now()}`,
        nama: identifier.includes('@') ? identifier.split('@')[0] : `Staff PN ${identifier}`,
        pn: identifier.includes('@') ? '00' + Math.floor(100000 + Math.random() * 900000) : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@bri.co.id`,
        jabatan: 'Staff Administrasi Kredit',
        role: 'Staff',
        unit: 'KCP Iskandar Palembang',
        status: 'Aktif',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        telepon: '0812-7000-8800'
      }
      setUsers((prev) => [demoUser, ...prev])
      setUser(demoUser)

      if (client) {
        try {
          await client.from('staf_pengguna').insert([demoUser])
        } catch (e) {
          // ignore
        }
      }

      return { success: true, user: demoUser, source: 'demo' }
    }
  }

  // Register handler connected to Supabase
  const register = async (newUser) => {
    const created = {
      id: `USR-${Date.now()}`,
      nama: newUser.nama,
      pn: newUser.pn || '00' + Math.floor(100000 + Math.random() * 900000),
      email: newUser.email,
      jabatan: newUser.jabatan || 'Staff Administrasi Kredit',
      role: newUser.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      status: 'Aktif',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      telepon: newUser.telepon || '-'
    }

    setUsers((prev) => [created, ...prev])
    setUser(created)

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').insert([created])
      } catch (err) {
        console.warn('Supabase register insert error:', err)
      }
    }

    return { success: true, user: created }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bri_surat_current_user')
  }

  const updateProfile = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    )

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').update(updatedData).eq('id', user.id)
      } catch (e) {
        console.warn('Supabase update profile error:', e)
      }
    }

    return { success: true }
  }

  const addUser = async (userData) => {
    const created = {
      id: `USR-${Date.now()}`,
      nama: userData.nama,
      pn: userData.pn,
      email: userData.email,
      jabatan: userData.jabatan,
      role: userData.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      status: userData.status || 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      telepon: userData.telepon || '-'
    }
    setUsers((prev) => [created, ...prev])

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').insert([created])
      } catch (e) {
        console.warn('Supabase insert user error:', e)
      }
    }

    return created
  }

  const deleteUser = async (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('staf_pengguna').delete().eq('id', userId)
      } catch (e) {
        console.warn('Supabase delete user error:', e)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        updateProfile,
        addUser,
        deleteUser,
        supabaseReady
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
