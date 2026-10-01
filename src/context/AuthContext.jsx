import { createContext, useContext, useState, useEffect } from 'react'
import { initialUsersList } from '../data/initialUsersData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Load users from localStorage or default
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

  // Current logged in user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bri_surat_current_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse current user', e)
      }
    }
    // Default to the Intern (user itself) so they can immediately test the dashboard
    return initialUsersList[4]
  })

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

  const login = (identifier, password) => {
    // Search by PN or Email
    const cleanId = identifier.trim().toLowerCase()
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.pn.toLowerCase() === cleanId
    )

    if (found) {
      setUser(found)
      return { success: true, user: found }
    } else {
      // If entered anything in demo, permit fallback login as staff
      const demoUser = {
        id: `USR-${Date.now()}`,
        nama: identifier.includes('@') ? identifier.split('@')[0] : `Staff PN ${identifier}`,
        pn: identifier.includes('@') ? '00' + Math.floor(100000 + Math.random() * 900000) : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@bri.co.id`,
        jabatan: 'Staff KCP Iskandar',
        role: 'Staff',
        unit: 'KCP Iskandar Palembang',
        status: 'Aktif',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        telepon: '0812-7000-8800'
      }
      setUsers((prev) => [demoUser, ...prev])
      setUser(demoUser)
      return { success: true, user: demoUser }
    }
  }

  const register = (newUser) => {
    const created = {
      id: `USR-${Date.now()}`,
      nama: newUser.nama,
      pn: newUser.pn || '00' + Math.floor(100000 + Math.random() * 900000),
      email: newUser.email,
      jabatan: newUser.jabatan || 'Staff Administrasi Kredit',
      role: newUser.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      status: 'Aktif',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      telepon: newUser.telepon || '-'
    }
    setUsers((prev) => [created, ...prev])
    setUser(created)
    return { success: true, user: created }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    )
    return { success: true }
  }

  const addUser = (userData) => {
    const created = {
      id: `USR-${Date.now()}`,
      nama: userData.nama,
      pn: userData.pn,
      email: userData.email,
      jabatan: userData.jabatan,
      role: userData.role || 'Staff',
      unit: 'KCP Iskandar Palembang',
      status: userData.status || 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      telepon: userData.telepon || '-'
    }
    setUsers((prev) => [created, ...prev])
    return created
  }

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
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
        deleteUser
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
